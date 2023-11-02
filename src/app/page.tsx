"use client";
import {useEffect, useState} from "react";
import {color as d3color} from "d3-color";

export default function Home() {
    // save state of colors
    const [colors, setColors] = useState<Color[]>([]);

    const generateHSL = (): HSLColor => {
        // Generate a random hue value between 0 and 360
        const hue = Math.floor(Math.random() * 360);
        // Set constant saturation and lightness values for flat colors
        const saturation = getRandomArbitrary(0, 100); // You can adjust this value
        const lightness = getRandomArbitrary(10, 100); // You can adjust this value

        // Convert HSL to a hexadecimal color code
        return {
            h: hue,
            s: saturation,
            l: lightness,
            cssString: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
        };
    }

    // listen to spacebar keypress
    useEffect(() => {

        if (!d3color) return;

        let tempColors: Color[] = [];

        for (let i = 0; i < 5; i++) {
            const randomColor = generateHSL();

            tempColors = [...tempColors, {
                hsl: randomColor,
                hex: d3color(randomColor.cssString)?.formatHex() || '',
                isLocked: false,
            }];
        }
        setColors(tempColors);

        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === ' ' || event.code === "Space") {
                // Run your function here
                regenerateColors();
            }
        };

        const regenerateColors = () => {
            let newColors: Color[] = [];
            tempColors.forEach(color => {
                if (color.isLocked) {
                    newColors = [...newColors, color];
                } else {
                    const randomColor = generateHSL();
                    newColors = [...newColors, {
                        hsl: randomColor,
                        hex: d3color(randomColor.cssString)?.formatHex() || '',
                        isLocked: false,
                    }];
                }
            });

            setColors(newColors);
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            // Clean up the event listener when the component unmounts
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);


    return (
        <main className="flex h-screen">
            {
                colors.map((color, index) => (
                    <div
                        key={index}
                        className="flex-1 flex flex-col justify-center items-center text-black"
                        style={{backgroundColor: color.hex}}
                    >
                        <span className="text-3xl slashed-zero lining-nums proportional-nums font-mono uppercase font-bold leading-3">
                            {color.hex}
                        </span>
                    </div>
                ))
            }
        </main>
    )
}

export interface Color {
    hsl: HSLColor;
    hex: string;
    isLocked: boolean;
}

function getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

interface HSLColor {
    h: number;
    s: number;
    l: number;
    cssString: string;
}
