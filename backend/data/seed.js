const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
require('dotenv').config();

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/e_learning_platform';

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected, seeding data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Quiz.deleteMany({});

    const faculty = new User({ name: 'Dr. Alice', email: 'alice@uni.edu', password: 'password', role: 'Faculty' });
    const student1 = new User({ name: 'Bob Student', email: 'bob@uni.edu', password: 'password', role: 'Student' });
    const student2 = new User({ name: 'Carol Student', email: 'carol@uni.edu', password: 'password', role: 'Student' });

    // NOTE: passwords here are plain; run registration endpoints in production to hash them properly.
    await faculty.save();
    await student1.save();
    await student2.save();

    const course = new Course({ title: 'Intro to Algorithms', description: 'Basics of algorithms', faculty: faculty._id });
    await course.save();

    const quiz = new Quiz({
      title: 'Algo Quiz 1',
      course: course._id,
      questions: [
        { question: 'What is the time complexity of binary search?', options: ['O(n)','O(log n)','O(n log n)','O(1)'], correctIndex: 1, points: 10 },
        { question: 'What is the best case of quicksort?', options: ['O(n^2)','O(n log n)','O(n)','O(log n)'], correctIndex: 1, points: 10 }
      ]
    });
    await quiz.save();

    console.log('Seed complete');
    process.exit(0);
  })
  .catch(err => { console.error(err); process.exit(1); });
