import React, { useEffect, useState } from 'react'

const mouseSize = 20;

const Mouse = () => {
    // on-going states
    const [mouse, setMouse] = useState({ x: 0, y: 0 })
    
    useEffect(() => {
        const updateMouse = (e) => setMouse({ x: e.clientX, y: e.clientY });
        window.addEventListener("mousemove", updateMouse);
        return () => window.removeEventListener("mousemove", updateMouse);
    }, []);

    return (
        <div
            style={{
                zIndex: "3",
                position: "absolute",
                pointerEvents: "none",
                top: mouse.y - mouseSize / 2,
                left: mouse.x - mouseSize / 2
            }}
        >
            <div
                style={{
                    width: mouseSize,
                    height: mouseSize, 
                    background: "gray",
                    opacity: .4,
                    borderRadius: mouseSize / 2
                }}
            />
        </div>
    );
};

export default Mouse;