import type { Technology } from "@/components/technology-card"

export const mockTechnologies: Technology[] = [
    {
        id: "1",
        title: "Bioplástico de Alta Resistência",
        summary: "Polímero a base de amido com reforço nanocelulósico que mantém resistência mecânica e reduz custo em 18%.",
        university: "UFPR",
        trl: 5,
        tags: ["Sustentabilidade", "Materiais", "Packaging"],
    },
    {
        id: "2",
        title: "Sensor IoT para Vazão Industrial",
        summary: "Módulo de baixo consumo com comunicação LoRa e calibração automática para plantas químicas.",
        university: "UFMG",
        trl: 7,
        tags: ["IoT", "Indústria 4.0", "Automação"],
    },
    {
        id: "3",
        title: "Algoritmo de Detecção de Falhas",
        summary: "Modelo híbrido (SVM + LSTM) para predição de falhas em motores elétricos com explainability.",
        university: "USP",
        trl: 6,
        tags: ["IA/ML", "Manutenção preditiva"],
    },
]