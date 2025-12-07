import { useCountUp } from '../hooks/use-countup';
import { motion } from 'framer-motion';

const CountUpStat = ({ value, label, icon: Icon, prefix = '', suffix = '', duration = 2000, index }) => {
  const { formattedCount, ref } = useCountUp({ 
    end: value, 
    duration, 
    prefix, 
    suffix 
  });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="text-center"
    >
      <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
      <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-1">
        {formattedCount}
      </div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </motion.div>
  );
};

export default CountUpStat;
