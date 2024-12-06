// Define the Exercise type with standardized reps and weight
export type Exercise = {
  exercise: string;
  sets: number;
  reps: number | string;
  weight: number;
};

// Define the Workout type
export type Workout = {
  id: number;
  name: string;
  level: string;
  time: number;
  exercises: Exercise[];
};

// Define the RiptWorkouts array with all 21 workouts
const RiptWorkouts: Workout[] = [
  {
    id: 1,
    name: "Shoulder Showdown",
    level: "Intermediate",
    time: 50,
    exercises: [
      {
        exercise: "Seated Overhead Dumbbell Press",
        sets: 4,
        reps: 10,
        weight: 25, // lbs
      },
      {
        exercise: "Rear Delt Cable Fly",
        sets: 3,
        reps: 8,
        weight: 15, // lbs
      },
      {
        exercise: "Dumbbell Lateral Raise",
        sets: 3,
        reps: 8,
        weight: 15, // lbs
      },
      {
        exercise: "Bent Over Rear Delt Fly",
        sets: 3,
        reps: 10,
        weight: 15, // lbs
      },
      {
        exercise: "Standing Dumbbell Press",
        sets: 3,
        reps: 6,
        weight: 30, // lbs
      },
      {
        exercise: "Dumbbell Shoulder Shrug",
        sets: 3,
        reps: 10,
        weight: 30, // lbs
      },
    ],
  },
  {
    id: 2,
    name: "Quad Squad Leg Day",
    level: "Intermediate",
    time: 60,
    exercises: [
      {
        exercise: "Walking Lunge",
        sets: 4,
        reps: "10",
        weight: 20, // lbs (holding dumbbells)
      },
      {
        exercise: "Front Squat",
        sets: 4,
        reps: 12,
        weight: 60, // lbs
      },
      {
        exercise: "Romanian Deadlift",
        sets: 4,
        reps: 8,
        weight: 70, // lbs
      },
      {
        exercise: "Leg Extension Machine",
        sets: 3,
        reps: 10,
        weight: 40, // lbs
      },
      {
        exercise: "Leg Curl Machine",
        sets: 3,
        reps: 10,
        weight: 40, // lbs
      },
      {
        exercise: "Calf Raise",
        sets: 3,
        reps: 12,
        weight: 50, // lbs
      },
    ],
  },
  {
    id: 3,
    name: "Flex Friday",
    level: "Beginner",
    time: 45,
    exercises: [
      {
        exercise: "Barbell Bicep Curl",
        sets: 4,
        reps: 10,
        weight: 20, // lbs
      },
      {
        exercise: "Alternating Incline Curl",
        sets: 3,
        reps: 8,
        weight: 15, // lbs
      },
      {
        exercise: "Preacher Curl",
        sets: 3,
        reps: 6,
        weight: 20, // lbs
      },
      {
        exercise: "Skullcrusher",
        sets: 4,
        reps: 10,
        weight: 20, // lbs
      },
      {
        exercise: "Tricep Dips",
        sets: 3,
        reps: 8,
        weight: 10, // lbs (assisted)
      },
      {
        exercise: "Rope Tricep Pulldown",
        sets: 3,
        reps: 8,
        weight: 25, // lbs
      },
    ],
  },
  {
    id: 4,
    name: "Chest Quest",
    level: "Advanced",
    time: 50,
    exercises: [
      {
        exercise: "Bench Press",
        sets: 4,
        reps: 12,
        weight: 100, // lbs
      },
      {
        exercise: "Lying Pectoral Fly",
        sets: 3,
        reps: 10,
        weight: 60, // lbs
      },
      {
        exercise: "Incline Dumbbell Bench Press",
        sets: 3,
        reps: 8,
        weight: 40, // lbs
      },
      {
        exercise: "Cable Chest Crossover",
        sets: 3,
        reps: 10,
        weight: 50, // lbs
      },
      {
        exercise: "Hammer Strength Machine Press",
        sets: 3,
        reps: 6,
        weight: 80, // lbs
      },
    ],
  },
  {
    id: 5,
    name: "BACK in Action",
    level: "Intermediate",
    time: 55,
    exercises: [
      {
        exercise: "Bent Over Row",
        sets: 4,
        reps: 10,
        weight: 70, // lbs
      },
      {
        exercise: "Lat Pull Down",
        sets: 4,
        reps: 10,
        weight: 60, // lbs
      },
      {
        exercise: "Seated Row",
        sets: 3,
        reps: 12,
        weight: 55, // lbs
      },
      {
        exercise: "Inverted Row",
        sets: 3,
        reps: 8,
        weight: 20, // lbs (added weight)
      },
      {
        exercise: "Straight Arm Cable Pulldown",
        sets: 3,
        reps: 12,
        weight: 40, // lbs
      },
    ],
  },
  {
    id: 6,
    name: "Push Powerhouse",
    level: "Advanced",
    time: 75,
    exercises: [
      {
        exercise: "Bench Press",
        sets: 4,
        reps: 8,
        weight: 120, // lbs
      },
      {
        exercise: "Incline Dumbbell Bench Press",
        sets: 4,
        reps: 8,
        weight: 50, // lbs
      },
      {
        exercise: "Pushups",
        sets: 3,
        reps: 10,
        weight: 20, // lbs (added weight)
      },
      {
        exercise: "Dumbbell Overhead Press",
        sets: 4,
        reps: 8,
        weight: 50, // lbs
      },
      {
        exercise: "Dumbbell Lateral Raise",
        sets: 3,
        reps: 10,
        weight: 20, // lbs
      },
      {
        exercise: "Tricep Pushdown",
        sets: 3,
        reps: 10,
        weight: 50, // lbs
      },
      {
        exercise: "Dumbbell Tricep Kickback",
        sets: 3,
        reps: 10,
        weight: 20, // lbs
      },
      {
        exercise: "Hanging Leg Raise",
        sets: 3,
        reps: 12,
        weight: 10, // lbs (added weight)
      },
      {
        exercise: "Decline Bench Reverse Sit-up",
        sets: 3,
        reps: 12,
        weight: 10, // lbs (added weight)
      },
      {
        exercise: "Flutter Kicks",
        sets: 3,
        reps: 10,
        weight: 0, // Bodyweight
      },
    ],
  },
  {
    id: 7,
    name: "Pull Day Pump",
    level: "Intermediate",
    time: 50,
    exercises: [
      {
        exercise: "Pullup",
        sets: 4,
        reps: 8,
        weight: 20, // lbs (added weight)
      },
      {
        exercise: "Bentover Row",
        sets: 4,
        reps: 8,
        weight: 60, // lbs
      },
      {
        exercise: "Lat Pulldown",
        sets: 4,
        reps: 8,
        weight: 60, // lbs
      },
      {
        exercise: "Seated Cable Row",
        sets: 4,
        reps: 8,
        weight: 50, // lbs
      },
      {
        exercise: "Standing Shrug",
        sets: 3,
        reps: 10,
        weight: 40, // lbs
      },
      {
        exercise: "Bicep Curl",
        sets: 3,
        reps: 10,
        weight: 25, // lbs
      },
      {
        exercise: "Hammer Curl",
        sets: 3,
        reps: 10,
        weight: 25, // lbs
      },
    ],
  },
  {
    id: 8,
    name: "Glute Gains Leg Day",
    level: "Advanced",
    time: 80,
    exercises: [
      {
        exercise: "Back Squat",
        sets: 4,
        reps: 8,
        weight: 150, // lbs
      },
      {
        exercise: "Deadlift",
        sets: 4,
        reps: 8,
        weight: 150, // lbs
      },
      {
        exercise: "Dumbbell Lunge",
        sets: 4,
        reps: 8,
        weight: 40, // lbs
      },
      {
        exercise: "Barbell Glute Bridge",
        sets: 4,
        reps: 10,
        weight: 100, // lbs
      },
      {
        exercise: "Elevated Standing Calf Raise",
        sets: 3,
        reps: 10,
        weight: 60, // lbs
      },
      {
        exercise: "Seated Calf Raise",
        sets: 3,
        reps: 10,
        weight: 60, // lbs
      },
      {
        exercise: "Horizontal Cable Woodchop",
        sets: 3,
        reps: 15,
        weight: 40, // lbs
      },
      {
        exercise: "Side Plank With Lateral",
        sets: 3,
        reps: "15ea",
        weight: 10, // lbs (added weight)
      },
    ],
  },
  {
    id: 9,
    name: "Pec-tacular Push",
    level: "Beginner",
    time: 45,
    exercises: [
      {
        exercise: "Cable Chest Fly",
        sets: 4,
        reps: 12,
        weight: 30, // lbs
      },
      {
        exercise: "Dumbbell Chest Fly",
        sets: 4,
        reps: 12,
        weight: 20, // lbs
      },
      {
        exercise: "Dumbbell Squat Front Raise",
        sets: 4,
        reps: 12,
        weight: 15, // lbs
      },
      {
        exercise: "Dumbbell Overhead Press",
        sets: 3,
        reps: 15,
        weight: 20, // lbs
      },
      {
        exercise: "Dumbbell Skullcrusher",
        sets: 3,
        reps: 15,
        weight: 15, // lbs
      },
      {
        exercise: "Bench Tricep Dip",
        sets: 3,
        reps: 15,
        weight: 10, // lbs
      },
    ],
  },
  {
    id: 10,
    name: "Pull Party",
    level: "Intermediate",
    time: 55,
    exercises: [
      {
        exercise: "Chinup",
        sets: 4,
        reps: 12,
        weight: 10, // lbs (added weight)
      },
      {
        exercise: "Single Arm Dumbbell Row",
        sets: 4,
        reps: "12ea",
        weight: 25, // lbs
      },
      {
        exercise: "Lat Pulldown",
        sets: 4,
        reps: 12,
        weight: 60, // lbs
      },
      {
        exercise: "Cable Rope Bicep Curl",
        sets: 3,
        reps: 15,
        weight: 30, // lbs
      },
      {
        exercise: "Bent Over Rear Delt Fly",
        sets: 3,
        reps: 12,
        weight: 15, // lbs
      },
      {
        exercise: "Weighted Crunches",
        sets: 3,
        reps: 12,
        weight: 10, // lbs
      },
      {
        exercise: "Weighted Russian Twists",
        sets: 3,
        reps: "12ea",
        weight: 10, // lbs
      },
    ],
  },
  {
    id: 11,
    name: "Leg Day Legends",
    level: "Advanced",
    time: 70,
    exercises: [
      {
        exercise: "Front Squat",
        sets: 4,
        reps: 6,
        weight: 100, // lbs
      },
      {
        exercise: "Goblet Squat",
        sets: 4,
        reps: 15,
        weight: 40, // lbs
      },
      {
        exercise: "Lying Hamstring Curl",
        sets: 4,
        reps: 15,
        weight: 60, // lbs
      },
      {
        exercise: "Single-leg Calf Raise",
        sets: 3,
        reps: 12,
        weight: 40, // lbs
      },
      {
        exercise: "Split Squat",
        sets: 3,
        reps: 15,
        weight: 40, // lbs
      },
      {
        exercise: "Hanging Knee Tuck Ups",
        sets: 3,
        reps: 10,
        weight: 10, // lbs (added weight)
      },
      {
        exercise: "Plank Hip Dips",
        sets: 3,
        reps: 15,
        weight: 10, // lbs (added weight)
      },
    ],
  },
  {
    id: 12,
    name: "Michael's Motion",
    level: "Advanced",
    time: 60,
    exercises: [
      {
        exercise: "Barbell Squat",
        sets: 4,
        reps: 8,
        weight: 135,
      },
      {
        exercise: "Deadlift",
        sets: 4,
        reps: 6,
        weight: 185,
      },
      {
        exercise: "Walking Lunge",
        sets: 3,
        reps: 12,
        weight: 40,
      },
      {
        exercise: "Leg Press",
        sets: 3,
        reps: 10,
        weight: 200,
      },
      {
        exercise: "Calf Raise",
        sets: 4,
        reps: 15,
        weight: 100,
      },
    ],
  },
  {
    id: 13,
    name: "Nate's Nautilus",
    level: "Intermediate",
    time: 55,
    exercises: [
      {
        exercise: "Lat Pulldown",
        sets: 4,
        reps: 10,
        weight: 80,
      },
      {
        exercise: "Seated Row",
        sets: 4,
        reps: 10,
        weight: 70,
      },
      {
        exercise: "Single-Arm Dumbbell Row",
        sets: 3,
        reps: 12,
        weight: 35,
      },
      {
        exercise: "Face Pull",
        sets: 3,
        reps: 15,
        weight: 30,
      },
      {
        exercise: "Bicep Curl",
        sets: 3,
        reps: 12,
        weight: 25,
      },
    ],
  },
  {
    id: 14,
    name: "Chris M's Core",
    level: "Beginner",
    time: 40,
    exercises: [
      {
        exercise: "Plank",
        sets: 3,
        reps: "60 seconds",
        weight: 0,
      },
      {
        exercise: "Russian Twists",
        sets: 3,
        reps: 20,
        weight: 15,
      },
      {
        exercise: "Bicycle Crunches",
        sets: 3,
        reps: 15,
        weight: 0,
      },
      {
        exercise: "Leg Raises",
        sets: 3,
        reps: 12,
        weight: 0,
      },
      {
        exercise: "Mountain Climbers",
        sets: 3,
        reps: 30,
        weight: 0,
      },
    ],
  },
  {
    id: 15,
    name: "Chris P's Pump",
    level: "Advanced",
    time: 70,
    exercises: [
      {
        exercise: "Bench Press",
        sets: 5,
        reps: 5,
        weight: 185,
      },
      {
        exercise: "Incline Dumbbell Press",
        sets: 4,
        reps: 8,
        weight: 50,
      },
      {
        exercise: "Dumbbell Flyes",
        sets: 4,
        reps: 10,
        weight: 30,
      },
      {
        exercise: "Tricep Dips",
        sets: 3,
        reps: 12,
        weight: 25,
      },
      {
        exercise: "Overhead Tricep Extension",
        sets: 3,
        reps: 10,
        weight: 40,
      },
    ],
  },
  {
    id: 16,
    name: "Tom's Tempo",
    level: "Intermediate",
    time: 50,
    exercises: [
      {
        exercise: "Treadmill Running",
        sets: 1,
        reps: "30 minutes",
        weight: 0,
      },
      {
        exercise: "Burpees",
        sets: 4,
        reps: 15,
        weight: 0,
      },
      {
        exercise: "Jump Squats",
        sets: 4,
        reps: 12,
        weight: 0,
      },
      {
        exercise: "Kettlebell Swings",
        sets: 3,
        reps: 20,
        weight: 35,
      },
      {
        exercise: "Box Jumps",
        sets: 3,
        reps: 10,
        weight: 0,
      },
    ],
  },
  {
    id: 17,
    name: "Natalie's Nitro",
    level: "Advanced",
    time: 65,
    exercises: [
      {
        exercise: "Deadlift",
        sets: 5,
        reps: 5,
        weight: 225,
      },
      {
        exercise: "Power Clean",
        sets: 4,
        reps: 6,
        weight: 135,
      },
      {
        exercise: "Front Squat",
        sets: 4,
        reps: 8,
        weight: 155,
      },
      {
        exercise: "Push Press",
        sets: 3,
        reps: 10,
        weight: 95,
      },
      {
        exercise: "Pull-Ups",
        sets: 4,
        reps: 10,
        weight: 0,
      },
    ],
  },
  {
    id: 18,
    name: "Ciara's Crunch",
    level: "Beginner",
    time: 35,
    exercises: [
      {
        exercise: "Crunches",
        sets: 3,
        reps: 20,
        weight: 0,
      },
      {
        exercise: "Reverse Crunches",
        sets: 3,
        reps: 15,
        weight: 0,
      },
      {
        exercise: "Plank",
        sets: 3,
        reps: "45 seconds",
        weight: 0,
      },
      {
        exercise: "Side Plank",
        sets: 3,
        reps: "30 seconds each side",
        weight: 0,
      },
      {
        exercise: "Heel Touches",
        sets: 3,
        reps: 25,
        weight: 0,
      },
    ],
  },
  {
    id: 19,
    name: "Evan's Energy",
    level: "Intermediate",
    time: 60,
    exercises: [
      {
        exercise: "Jump Rope",
        sets: 5,
        reps: "2 minutes",
        weight: 0,
      },
      {
        exercise: "High Knees",
        sets: 4,
        reps: "1 minute",
        weight: 0,
      },
      {
        exercise: "Mountain Climbers",
        sets: 4,
        reps: 30,
        weight: 0,
      },
      {
        exercise: "Burpees",
        sets: 4,
        reps: 15,
        weight: 0,
      },
      {
        exercise: "Tuck Jumps",
        sets: 3,
        reps: 12,
        weight: 0,
      },
    ],
  },
  {
    id: 20,
    name: "Tina's Toning",
    level: "Beginner",
    time: 45,
    exercises: [
      {
        exercise: "Dumbbell Shoulder Press",
        sets: 3,
        reps: 12,
        weight: 20,
      },
      {
        exercise: "Lateral Raises",
        sets: 3,
        reps: 15,
        weight: 15,
      },
      {
        exercise: "Front Raises",
        sets: 3,
        reps: 15,
        weight: 15,
      },
      {
        exercise: "Tricep Kickbacks",
        sets: 3,
        reps: 15,
        weight: 10,
      },
      {
        exercise: "Bicep Curls",
        sets: 3,
        reps: 15,
        weight: 15,
      },
    ],
  },
  {
    id: 21,
    name: "Rob's Ripper",
    level: "Advanced",
    time: 70,
    exercises: [
      {
        exercise: "Bench Press",
        sets: 5,
        reps: 5,
        weight: 225,
      },
      {
        exercise: "Bent Over Row",
        sets: 4,
        reps: 8,
        weight: 185,
      },
      {
        exercise: "Overhead Press",
        sets: 4,
        reps: 6,
        weight: 155,
      },
      {
        exercise: "Pull-Ups",
        sets: 4,
        reps: 10,
        weight: 25,
      },
      {
        exercise: "Dips",
        sets: 4,
        reps: 12,
        weight: 25,
      },
      {
        exercise: "Barbell Curls",
        sets: 3,
        reps: 10,
        weight: 50,
      },
      {
        exercise: "Skull Crushers",
        sets: 3,
        reps: 10,
        weight: 40,
      },
    ],
  },
];

export default RiptWorkouts;
