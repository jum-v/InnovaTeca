#!/usr/bin/env bash
set -euo pipefail

############################################
# Configuração do usuário
############################################
IGNORE_PATTERNS=(
  ".git"
  ".idea"
  ".vscode"
  "node_modules"
  "public"
  "dist"
  "build"
  ".venv"
  "venv"
  "__pycache__",
  "package-lock.json"
  "*.log"
  "*.lock"
  "*.jpg" "*.jpeg" "*.png" "*.gif" "*.webp" "*.bmp" "*.ico"
  "*.pdf" "*.zip" "*.tar" "*.tar.*" "*.7z" "*.rar"
  "*.exe" "*.dll" "*.so" "*.dylib"
  "*.class" "*.o" "*.a"
  "*.DS_Store",
  "dump-context.sh",
  "next.config.js",
  "yarn.lock",
  "postcss.config.js",
  "tailwind.config.js",
  "pnpm-lock.yaml",
  ".env.exemple",
  "migrations",
  "components.json",
  "node-version",
  "biome.json",
  ".next",
  ".parcel-cache",
  ".turbo",
  ".cache",
  "LICENSE",
  ".gitignore",
  "src/app/globals.css"
)

############################################
# Saída / tmp
############################################
OUTPUT_FILE="${1:-context_dump.txt}"
TMP_LIST_DIRS="$(mktemp)"
TMP_LIST_FILES="$(mktemp)"
trap 'rm -f "$TMP_LIST_DIRS" "$TMP_LIST_FILES"' EXIT

############################################
# Helpers
############################################
trim_cr_spaces() {
  local s="$1"
  s="${s%$'\r'}"                                # tira CR (se houver)
  s="${s#"${s%%[![:space:]]*}"}"                # ltrim
  s="${s%"${s##*[![:space:]]}"}"                # rtrim
  printf '%s' "$s"
}

# Converte um padrão glob para regex:
#  - escapa meta-regex
#  - '*' → '.*' ; '?' → '.'
#  - mantém '/' literal
glob_to_regex() {
  local g="$1"
  # escapa regex meta chars
  g="$(printf '%s' "$g" | sed -E 's/([][(){}.^$+|\\])/\\\1/g')"
  # glob -> regex
  g="${g//\*/.*}"
  g="${g//\?/.}"
  printf '%s' "$g"
}

# Monta um regex ÚNICO que casará QUALQUER item da blacklist em QUALQUER lugar do caminho.
# Regras:
#  - se o padrão tiver '/', tratamos como trecho de caminho → casará como substring do path
#  - se for nome simples (sem '/'), casará como componente: (^|/)NOME(/|$)
#  - se tiver glob, passamos por glob_to_regex antes
build_ignore_regex() {
  local parts=() p has_slash is_glob re
  for p in "${IGNORE_PATTERNS[@]}"; do
    p="$(trim_cr_spaces "${p%,}")"
    [[ -z "$p" ]] && continue
    [[ "$p" == "$OUTPUT_FILE" ]] && continue

    has_slash=0; [[ "$p" == */* ]] && has_slash=1
    is_glob=0;   [[ "$p" == *[\*\?[]* ]] && is_glob=1

    if (( is_glob )); then
      re="$(glob_to_regex "$p")"
      if (( has_slash )); then
        # contém barra: substring no path
        parts+=( "$re" )
      else
        # sem barra: tratar como componente
        parts+=( "(^|/)$re(/|$)" )
      fi
    else
      # sem glob
      if (( has_slash )); then
        parts+=( "$(glob_to_regex "$p")" )
      else
        parts+=( "(^|/)$(glob_to_regex "$p")(/|$)" )
      fi
    fi
  done
  # também ignore o próprio arquivo de saída
  parts+=( "(^|/)$(glob_to_regex "$OUTPUT_FILE")$" )

  # junta tudo em um único regex com |
  local IFS='|'
  printf '%s' "${parts[*]}"
}

# Detecta binário
is_text_file() {
  local f="$1"
  grep -Iq . "$f" 2>/dev/null
}

relpath() {
  printf '%s\n' "${1#./}"
}

############################################
# Coleta (find) + filtro por regex
############################################
IGNORE_REGEX="$(build_ignore_regex)"

# Diretórios
find . -type d -print | sort \
| sed 's|^\./||' \
| awk -v RS='\n' -v IGNRE="$IGNORE_REGEX" '
  BEGIN { IGNORECASE=0 }
  $0 ~ IGNRE { next }    # pula ignorados
  { print }
' > "$TMP_LIST_DIRS"

# Arquivos
find . -type f -print | sort \
| sed 's|^\./||' \
| awk -v RS='\n' -v IGNRE="$IGNORE_REGEX" '
  BEGIN { IGNORECASE=0 }
  $0 ~ IGNRE { next }    # pula ignorados
  { print }
' > "$TMP_LIST_FILES"

############################################
# Escrita do relatório
############################################
{
  printf '# Context Dump\n'
  printf '# Base: %s\n' "$(pwd)"
  printf '# Gerado em: %s\n' "$(date -Iseconds)"
  printf '# Itens ignorados: '
  (IFS='; '; printf '%s\n' "${IGNORE_PATTERNS[*]}")

  printf '\n\n## Árvore de diretórios (filtrada)\n'
  awk '
    {
      n=split($0, parts, "/");
      path="";
      for (i=1;i<=n;i++){
        if (parts[i]=="") continue;
        path=path "/" parts[i];
        indent="";
        for (j=1;j<i;j++) indent=indent "  ";
        if (!(path in seen)) {
          seen[path]=1;
          printf("%s%s\n", indent, parts[i]);
        }
      }
    }
  ' "$TMP_LIST_DIRS"

  printf '\n\n## Conteúdo dos arquivos (filtrados)\n'
  total_files=$(wc -l < "$TMP_LIST_FILES" | tr -d ' ')
  printf '# Total de arquivos considerados: %s\n\n' "$total_files"

  while IFS= read -r file; do
    [[ -z "$file" ]] && continue
    # evita despejar o próprio arquivo de saída
    if [[ "$(realpath -q "$file" 2>/dev/null || echo "")" == "$(realpath -q "$OUTPUT_FILE" 2>/dev/null || echo "___")" ]]; then
      continue
    fi
    if [[ ! -r "$file" ]]; then
      printf '\n----- %s -----\n[ERRO] Sem permissão de leitura.\n' "$file"
      continue
    fi
    if ! is_text_file "$file"; then
      printf '\n----- %s -----\n[BINÁRIO] Conteúdo omitido.\n' "$file"
      continue
    fi
    printf '\n----- %s -----\n' "$file"
    cat -- "$file"
    printf '\n'
  done < "$TMP_LIST_FILES"
} > "$OUTPUT_FILE"

printf 'Arquivo gerado: %s\n' "$OUTPUT_FILE"
