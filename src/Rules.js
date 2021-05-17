export const rules = [
    {
        text: "1. The objective of this game is to maximize your score.",
        points: []
    },
    {
        text: "2. Points are awared for:",
        points: [
            "A. Playing moves without seeing the pieces (ranges from +12 to +20 depending on level).",
            "B. Material advantages (standard piece value times +20).",
            "C. Winning the game (+100)."
        ]
    }, 
    {
        text: "3. Points are deducted for:",
        points: [
            "A. Playing moves with the pieces visible (-10).",
            "B. Material deficits (standard piece value times -20).",
            "C. Trying to play an illegal move (-5).",
            "D. Clicking to view pieces."
        ]
    },
    {
        text: "4. No points are lost for losses or draws.",
        points: []
    }
]