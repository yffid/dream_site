import { motion } from 'framer-motion';

interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'pulse';
  text?: string;
}

const loadingVariants = {
  spinner: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  },
  pulse: {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
};

export function LoadingState({ type = 'spinner', text }: LoadingStateProps) {
  if (type === 'skeleton') {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {type === 'spinner' ? (
        <motion.div
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          variants={loadingVariants.spinner}
          animate="animate"
        />
      ) : (
        <motion.div
          className="w-16 h-16 bg-blue-500 rounded-full"
          variants={loadingVariants.pulse}
          animate="animate"
        />
      )}
      {text && (
        <p className="mt-4 text-gray-600 text-center">
          {text}
        </p>
      )}
    </div>
  );
}
