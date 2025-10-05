'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { UniversityHeader } from '@/components/university-header';

interface Technology {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  trl: string | null;
  tags: string[];
  created_at: string;
}

export function UniversityDashboard() {
  const { user, userType, loading, signOut } = useAuth();
  const router = useRouter();
  const [universityData, setUniversityData] = useState<any>(null);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [isLoadingTechnologies, setIsLoadingTechnologies] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user || userType !== 'university') {
        toast.error('Acesso negado');
        router.push('/');
        return;
      }

      // Buscar dados da universidade
      setUniversityData({
        name: user.user_metadata?.name || 'Universidade',
        email: user.email,
      });

      // Buscar tecnologias da universidade
      fetchTechnologies();
    }
  }, [user, userType, loading, router]);

  const fetchTechnologies = async () => {
    if (!user) return;

    try {
      setIsLoadingTechnologies(true);
      const response = await fetch(`/api/technologies?university_id=${user.id}`);
      const data = await response.json();

      if (response.ok) {
        setTechnologies(data.technologies);
      } else {
        toast.error('Erro ao carregar tecnologias');
      }
    } catch (error) {
      toast.error('Erro ao carregar tecnologias');
    } finally {
      setIsLoadingTechnologies(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Logout realizado com sucesso!');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader onSignOut={handleSignOut} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Minhas Tecnologias</h2>
              <p className="text-muted-foreground">
                Gerencie as inovações cadastradas pela sua universidade
              </p>
            </div>
            <Button
              variant="hero"
              onClick={() => router.push('/university/new-technology')}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Tecnologia
            </Button>
          </div>
        </div>

        {isLoadingTechnologies ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando tecnologias...</p>
          </div>
        ) : technologies.length === 0 ? (
          <div className="border rounded-lg p-12 text-center">
            <p className="text-muted-foreground mb-4">
              Nenhuma tecnologia cadastrada ainda.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push('/university/new-technology')}
            >
              Cadastrar primeira tecnologia
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {technologies.map((tech) => (
              <div key={tech.id} className="border rounded-lg hover:shadow-lg transition-all bg-card flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg line-clamp-2 flex-1">{tech.title}</h3>
                    {tech.trl && (
                      <Badge variant="outline" className="ml-2">
                        TRL {tech.trl}
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{tech.excerpt}</p>

                  {tech.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tech.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t p-4 flex gap-2 mt-auto">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
