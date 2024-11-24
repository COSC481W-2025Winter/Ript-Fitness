export type Exercise = {
  exercise: string; 
  sets: number; 
  reps: any; 
};

export type Workout = {
  id: number;
  name: string; 
  level: string;
  time: number; 
  exercises: Exercise[];
};

const RiptWorkouts: Workout[] = [
    {
      "id": 1,
      "name": "Shoulder Showdown",
      "level": "Intermediate", 
      "time": 50, 
      "exercises": [
        { "exercise": "Seated Overhead Dumbbell Press", "sets": 4, "reps": 10 },
        { "exercise": "Rear Delt Cable Fly", "sets": 3, "reps": 8 },
        { "exercise": "Dumbbell Lateral Raise", "sets": 3, "reps": 8 },
        { "exercise": "Bent Over Rear Delt Fly", "sets": 3, "reps": 10 },
        { "exercise": "Standing Dumbbell Press", "sets": 3, "reps": 6 },
        { "exercise": "Dumbbell Shoulder Shrug", "sets": 3, "reps": 10 }
      ]
    },
    {
      "id": 2,
      "name": "Quad Squad Leg Day",
      "level": "Intermediate", 
      "time": 60, 
      "exercises": [
        { "exercise": "Walking Lunge", "sets": 4, "reps": "10" },
        { "exercise": "Front Squat", "sets": 4, "reps": 12 },
        { "exercise": "Romanian Deadlift", "sets": 4, "reps": 8 },
        { "exercise": "Leg Extension Machine", "sets": 3, "reps": 10 },
        { "exercise": "Leg Curl Machine", "sets": 3, "reps": 10 },
        { "exercise": "Calf Raise", "sets": 3, "reps": 12 }
      ]
    },
    {
      "id": 3,
      "name": "Flex Friday",
      "level": "Beginner", 
      "time": 45, 
      "exercises": [
        { "exercise": "Barbell Bicep Curl", "sets": 4, "reps": 10 },
        { "exercise": "Alternating Incline Curl", "sets": 3, "reps": 8 },
        { "exercise": "Preacher Curl", "sets": 3, "reps": 6 },
        { "exercise": "Skullcrusher", "sets": 4, "reps": 10 },
        { "exercise": "Tricep Dips", "sets": 3, "reps": 8 },
        { "exercise": "Rope Tricep Pulldown", "sets": 3, "reps": 8 }
      ]
    },
    {
      "id": 4,
      "name": "Chest Quest",
      "level": "Advanced", 
      "time": 50, 
      "exercises": [
        { "exercise": "Bench Press", "sets": 4, "reps": [12, 10, 8, 6] },
        { "exercise": "Lying Pectoral Fly", "sets": 3, "reps": 10 },
        { "exercise": "Incline Dumbbell Bench Press", "sets": 3, "reps": 8 },
        { "exercise": "Cable Chest Crossover", "sets": 3, "reps": 10 },
        { "exercise": "Hammer Strength Machine Press", "sets": 3, "reps": 6 }
      ]
    },
    {
      "id": 5,
      "name": "BACK in Action",
      "level": "Intermediate", 
      "time": 55, 
      "exercises": [
        { "exercise": "Bent Over Row", "sets": 4, "reps": 10 },
        { "exercise": "Lat Pull Down", "sets": 4, "reps": 10 },
        { "exercise": "Seated Row", "sets": 3, "reps": 12 },
        { "exercise": "Inverted Row", "sets": 3, "reps": 8 },
        { "exercise": "Straight Arm Cable Pulldown", "sets": 3, "reps": 12 }
      ]
    },
    {
      "id": 6,
      "name": "Push Powerhouse",
      "level": "Advanced", 
      "time": 75, 
      "exercises": [
        { "exercise": "Bench Press", "sets": 4, "reps": 8 },
        { "exercise": "Incline Dumbbell Bench Press", "sets": 4, "reps": 8 },
        { "exercise": "Pushups", "sets": 3, "reps": 10 },
        { "exercise": "Dumbbell Overhead Press", "sets": 4, "reps": 8 },
        { "exercise": "Dumbbell Lateral Raise", "sets": 3, "reps": 10 },
        { "exercise": "Tricep Pushdown", "sets": 3, "reps": 10 },
        { "exercise": "Dumbbell Tricep Kickback", "sets": 3, "reps": 10 },
        { "exercise": "Hanging Leg Raise", "sets": 3, "reps": 12 },
        { "exercise": "Decline Bench Reverse Sit-up", "sets": 3, "reps": 12 },
        { "exercise": "Flutter Kicks", "sets": 3, "reps": 10 }
      ]
    },
    {
      "id": 7,
      "name": "Pull Day Pump",
      "level": "Intermediate", 
      "time": 50, 
      "exercises": [
        { "exercise": "Pullup", "sets": 4, "reps": 8 },
        { "exercise": "Bentover Row", "sets": 4, "reps": 8 },
        { "exercise": "Lat Pulldown", "sets": 4, "reps": 8 },
        { "exercise": "Seated Cable Row", "sets": 4, "reps": 8 },
        { "exercise": "Standing Shrug", "sets": 3, "reps": 10 },
        { "exercise": "Bicep Curl", "sets": 3, "reps": 10 },
        { "exercise": "Hammer Curl", "sets": 3, "reps": 10 }
      ]
    },
    {
      "id": 8,
      "name": "Glute Gains Leg Day",
      "level": "Advanced", 
      "time": 80, 
      "exercises": [
        { "exercise": "Back Squat", "sets": 4, "reps": 8 },
        { "exercise": "Deadlift", "sets": 4, "reps": 8 },
        { "exercise": "Dumbbell Lunge", "sets": 4, "reps": 8 },
        { "exercise": "Barbell Glute Bridge", "sets": 4, "reps": 10 },
        { "exercise": "Elevated Standing Calf Raise", "sets": 3, "reps": 10 },
        { "exercise": "Seated Calf Raise", "sets": 3, "reps": 10 },
        { "exercise": "Horizontal Cable Woodchop", "sets": 3, "reps": 15 },
        { "exercise": "Side Plank With Lateral", "sets": 3, "reps": "15ea" }
      ]
    },
    {
      "id": 9,
      "name": "Pec-tacular Push",
      "level": "Beginner", 
      "time": 45, 
      "exercises": [
        { "exercise": "Cable Chest Fly", "sets": 4, "reps": 12 },
        { "exercise": "Dumbbell Chest Fly", "sets": 4, "reps": 12 },
        { "exercise": "Dumbbell Squat Front Raise", "sets": 4, "reps": 12 },
        { "exercise": "Dumbbell Overhead Press", "sets": 3, "reps": 15 },
        { "exercise": "Dumbbell Skullcrusher", "sets": 3, "reps": 15 },
        { "exercise": "Bench Tricep Dip", "sets": 3, "reps": 15 }
      ]
    },
    {
      "id": 10,
      "name": "Pull Party",
      "level": "Intermediate", 
      "time": 55, 
      "exercises": [
        { "exercise": "Chinup", "sets": 4, "reps": 12 },
        { "exercise": "Single Arm Dumbbell Row", "sets": 4, "reps": "12ea" },
        { "exercise": "Lat Pulldown", "sets": 4, "reps": 12 },
        { "exercise": "Cable Rope Bicep Curl", "sets": 3, "reps": 15 },
        { "exercise": "Bent Over Rear Delt Fly", "sets": 3, "reps": 12 },
        { "exercise": "Weighted Crunches", "sets": 3, "reps": 12 },
        { "exercise": "Weighted Russian Twists", "sets": 3, "reps": "12ea" }
      ]
    },
    {
      "id": 11,
      "name": "Leg Day Legends",
      "level": "Advanced", 
      "time": 70, 
      "exercises": [
        { "exercise": "Front Squat", "sets": 4, "reps": 6 },
        { "exercise": "Goblet Squat", "sets": 4, "reps": 15 },
        { "exercise": "Lying Hamstring Curl", "sets": 4, "reps": 15 },
        { "exercise": "Single-leg Calf Raise", "sets": 3, "reps": 12 },
        { "exercise": "Split Squat", "sets": 3, "reps": 15 },
        { "exercise": "Hanging Knee Tuck Ups", "sets": 3, "reps": 10 },
        { "exercise": "Plank Hip Dips","sets": 3, "reps": 15 }
      ]
    }
]

export default RiptWorkouts;
  