
export class AITaskPlanner {
  generate(input: {
    goal: string;
    level: "beginner" | "intermediate" | "advanced";
    duration: number;
    type: "fitness" | "nutrition" | "mental";
  }) {
    const tasks = [];

    for (let day = 1; day <= input.duration; day++) {
      const progression = this.getProgression(input.level, day);

      tasks.push({
        dayNumber: day,
        type: input.type,
        title: this.generateTitle(input.goal, day),
        description: this.generateDescription(input.goal, input.level),

        unit: "reps",
        targetValue: progression.target,

        difficulty: this.mapDifficulty(input.level, day),
        isOptional: false,
        isLocked: day === 1 ? false : true,
      });
    }

    return tasks;
  }

  private getProgression(
    level: "beginner" | "intermediate" | "advanced",
    day: number
  ) {
    const base = level === "beginner" ? 10 : level === "intermediate" ? 20 : 30;

    return {
      target: base + day * 2,
    };
  }

  private generateTitle(goal: string, day: number) {
    return `${goal} - Day ${day}`;
  }

  private generateDescription(goal: string, level: string) {
    return `AI-generated ${level} level task focused on ${goal}`;
  }

  private mapDifficulty(level: string, day: number) {
    if (level === "beginner") return "easy";
    if (level === "intermediate") return day > 10 ? "hard" : "medium";
    return "hard";
  }
}