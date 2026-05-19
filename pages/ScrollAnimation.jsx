// src/components/animations/ScrollAnimation.jsx
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const ScrollAnimation = ({ children, direction = "up", delay = 0 }) => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "center center"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
    const scale = useTransform(scrollYProgress, [0, 0.3], [0.8, 1]);
    
    // Calculate animation direction
    const x = direction === "left" 
        ? useTransform(scrollYProgress, [0, 0.3], [-100, 0])
        : direction === "right"
        ? useTransform(scrollYProgress, [0, 0.3], [100, 0])
        : 0;
        
    const y = direction === "up"
        ? useTransform(scrollYProgress, [0, 0.3], [100, 0])
        : direction === "down"
        ? useTransform(scrollYProgress, [0, 0.3], [-100, 0])
        : 0;

    return (
        <motion.div
            ref={sectionRef}
            style={{
                opacity,
                scale,
                x,
                y,
                width: '100%',
                position: 'relative'
            }}
            transition={{ 
                duration: 0.8, 
                delay,
                ease: [0.17, 0.55, 0.55, 1] 
            }}
        >
            {children}
        </motion.div>
    );
};
