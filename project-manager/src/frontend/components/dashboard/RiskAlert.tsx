import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Project } from '@/data/mockData';

const RiskAlert = ({ projects }: { projects: Project[] }) => {
  const navigate = useNavigate();
  const atRisk = projects.filter(p => p.riskScore > 50);

  if (atRisk.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl border border-warning/20 bg-warning/5 p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <h3 className="text-sm font-semibold text-foreground">Análise Preditiva de Riscos</h3>
      </div>
      <div className="space-y-3">
        {atRisk.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            className="flex items-center justify-between rounded-lg bg-card/50 p-3 cursor-pointer hover:bg-card transition-colors group"
          >
            <div>
              <p className="text-sm font-medium text-foreground">{project.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Risco de atraso: <span className="text-warning font-medium">{project.riskScore}%</span>
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RiskAlert;
