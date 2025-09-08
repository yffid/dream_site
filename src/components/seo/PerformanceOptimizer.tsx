import React, { lazy, Suspense } from 'react';

// Lazy load non-critical components
export const LazyRobotAnimation = lazy(() => 
  import('@/components/ui/robot-animation').then(module => ({ 
    default: module.RobotAnimation 
  }))
);

export const LazyNeuralCore = lazy(() => 
  import('@/components/ui/neural-core').then(module => ({ 
    default: module.NeuralCore 
  }))
);

// Fallback loading component
export function ComponentFallback() {
  return (
    <div className="flex items-center justify-center h-32 w-32 bg-momta-night/20 rounded-lg animate-pulse">
      <div className="w-8 h-8 border-2 border-momta-blue border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

// Performance wrapper for heavy components
export function LazyWrapper({ children, fallback }: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  return (
    <Suspense fallback={fallback || <ComponentFallback />}>
      {children}
    </Suspense>
  );
}

// Image optimization component
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  width?: number;
  height?: number;
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      className={className}
      {...props}
    />
  );
}