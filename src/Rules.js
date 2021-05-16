export const rules = [
    {
        text: "1. Players start with 0 points and objective is to maximize the score.",
        points: []
    },
    {
        text: "2. Points are awared for:",
        points: [
            "A. Playing moves without seeing the pieces (ranges from +12 to +20 depending on level).",
            "B. Material advantages (standard piece value times +10).",
            "C. Winning the game (+100)."
        ]
    }, 
    {
        text: "3. Points are deducted for:",
        points: [
            "A. Playing moves with the pieces visible (-10).",
            "B. Material deficits (standard piece value times -10)."
        ]
    },
    {
        text: "4. No points are lost for losses or draws.",
        points: []
    }
]