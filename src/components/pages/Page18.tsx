import React, { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';

interface Page18Props {
    isActive: boolean;
    isPaused?: boolean;
}

const contentBlocks = [
    {
        title: "PREMIUM PROGRAMMING ON SITE",
        description: "Festival talks, intimate breakfasts, long-table lunches, and the Healers Circle all hosted within Suryagarh's iconic spaces."
    },
    {
        title: "ICONIC EXPERIENCES",
        description: "Festival talks, intimate breakfasts, long-table lunches, and the Healers Circle all hosted within Suryagarh's iconic spaces."
    },
    {
        title: "CONTENT THAT TRAVELS",
        description: "High-end photography, cinematic video, and influencer-driven social media placing Suryagarh on feeds worldwide."
    },
    {
        title: "INTERNATIONAL PRESS POTENTIAL",
        description: "Coverage across European and global lifestyle media highlighting Suryagarh as the festival's home."
    }
];

export const Page18: React.FC<Page18Props> = ({ isActive, isPaused }) => {
    const [visibleBlocks, setVisibleBlocks] = useState<number[]>([]);

    useEffect(() => {
        if (isActive) {
            // Stagger the animation - each block appears one by one
            contentBlocks.forEach((_, index) => {
                const timer = setTimeout(() => {
                    setVisibleBlocks(prev => [...prev, index]);
                }, 1000 + (index * 1500)); // 1.5s delay between each block
                return () => clearTimeout(timer);
            });
        } else {
            setVisibleBlocks([]);
        }
    }, [isActive]);

    return (
        <PageWrapper isActive={isActive} overlayOpacity={0}>
            {/* Dark sandy background matching theme */}
            <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[hsl(35,25%,50%)]">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(38,28%,55%)] via-[hsl(35,25%,50%)] to-[hsl(32,22%,42%)]" />
                
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full bg-[hsl(35,45%,40%)] blur-3xl" />
                    <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-[hsl(25,35%,35%)] blur-3xl" />
                </div>

                {/* Content Container */}
                <div className="relative z-10 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
                    {/* Blocks Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
                        {contentBlocks.map((block, index) => (
                            <div
                                key={index}
                                className={`p-6 md:p-8 border border-[hsl(40,30%,70%)]/30 rounded-sm bg-[hsl(35,20%,45%)]/30 backdrop-blur-sm
                                    transition-all duration-[2500ms] ease-in
                                    ${visibleBlocks.includes(index) 
                                        ? 'opacity-100 translate-y-0' 
                                        : 'opacity-0 translate-y-8'
                                    }`}
                            >
                                {/* Block Title */}
                                <h2 className="font-display text-base md:text-lg lg:text-xl text-[hsl(40,35%,85%)] tracking-[0.2em] uppercase mb-4">
                                    {block.title}
                                </h2>
                                
                                {/* Decorative line */}
                                <div className="w-16 h-[1px] bg-gradient-to-r from-[hsl(40,40%,70%)] to-transparent mb-4" />
                                
                                {/* Block Description */}
                                <p className="font-display text-sm md:text-base text-[hsl(40,25%,80%)] tracking-[0.1em] leading-relaxed normal-case">
                                    {block.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};
