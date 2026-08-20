// Seed script for EduMaster LMS on Supabase PostgreSQL
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Supabase PostgreSQL database...');

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@edumaster.com' },
    update: {
      username: 'EduMaster Admin',
      role: 'admin',
    },
    create: {
      username: 'EduMaster Admin',
      email: 'admin@edumaster.com',
      password: adminPassword,
      role: 'admin',
      avatarPublicId: 'default_avatar_id',
      avatarSecureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    },
  });
  console.log(`👤 Admin user created/verified: ${adminUser.email} (${adminUser.id})`);

  // 2. Create Student User
  const studentPassword = await bcrypt.hash('student123', 10);
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@edumaster.com' },
    update: {
      username: 'Demo Student',
      role: 'student',
    },
    create: {
      username: 'Demo Student',
      email: 'student@edumaster.com',
      password: studentPassword,
      role: 'student',
      avatarPublicId: 'default_avatar_id',
      avatarSecureUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80',
    },
  });
  console.log(`👤 Student user created/verified: ${studentUser.email} (${studentUser.id})`);

  // 3. Create Sample Courses & Lectures
  const coursesData = [
    {
      title: 'Fullstack Web Development with React & Node',
      description: 'Master fullstack development from scratch using modern React 18, Node.js Express, and relational PostgreSQL databases.',
      category: 'Web Development',
      createdBy: 'EduMaster Admin',
      createdById: adminUser.id,
      thumbnailPublicId: 'course_web_dev',
      thumbnailSecureUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      lectures: [
        {
          title: '01. Introduction to Web Architecture',
          description: 'Understanding client-server communication, HTTP protocols, and REST APIs.',
          publicId: 'lec_web_1',
          secureUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          orderIndex: 1,
        },
        {
          title: '02. React Components & Hooks Essentials',
          description: 'State management, custom hooks, and component lifecycle best practices.',
          publicId: 'lec_web_2',
          secureUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          orderIndex: 2,
        },
        {
          title: '03. Node.js & Express API Development',
          description: 'Building secure RESTful backend endpoints with Express middleware and JWT.',
          publicId: 'lec_web_3',
          secureUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          orderIndex: 3,
        },
      ],
    },
    {
      title: 'Data Science & Machine Learning Fundamentals',
      description: 'Comprehensive guide to Python, Data Analysis with Pandas, Visualization, and Machine Learning algorithms.',
      category: 'Data Science',
      createdBy: 'EduMaster Admin',
      createdById: adminUser.id,
      thumbnailPublicId: 'course_data_science',
      thumbnailSecureUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      lectures: [
        {
          title: '01. Data Analysis with Python & Pandas',
          description: 'Data wrangling, cleaning, and matrix manipulations using Python.',
          publicId: 'lec_ds_1',
          secureUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
          orderIndex: 1,
        },
        {
          title: '02. Supervised Learning & Regression Models',
          description: 'Linear regression, decision trees, and model evaluation metrics.',
          publicId: 'lec_ds_2',
          secureUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
          orderIndex: 2,
        },
      ],
    },
    {
      title: 'Cloud DevOps & Infrastructure Automation',
      description: 'Learn Docker, Kubernetes, CI/CD pipelines, and cloud deployment strategies on AWS & Supabase.',
      category: 'DevOps',
      createdBy: 'EduMaster Admin',
      createdById: adminUser.id,
      thumbnailPublicId: 'course_devops',
      thumbnailSecureUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80',
      lectures: [
        {
          title: '01. Containerization with Docker',
          description: 'Building Docker images, multi-stage builds, and Docker Compose environments.',
          publicId: 'lec_devops_1',
          secureUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
          orderIndex: 1,
        },
      ],
    },
  ];

  for (const cData of coursesData) {
    const { lectures, ...courseInfo } = cData;

    // Create or find course
    let course = await prisma.course.findFirst({
      where: { title: courseInfo.title },
    });

    if (!course) {
      course = await prisma.course.create({
        data: {
          ...courseInfo,
          numberOfLectures: lectures.length,
        },
      });
      console.log(`📚 Created course: ${course.title} (${course.id})`);

      for (const lec of lectures) {
        await prisma.lecture.create({
          data: {
            ...lec,
            courseId: course.id,
          },
        });
      }
    }

    // Enroll student user in first course & set progress
    if (cData.category === 'Web Development') {
      await prisma.courseEnrollment.upsert({
        where: {
          userId_courseId: {
            userId: studentUser.id,
            courseId: course.id,
          },
        },
        update: {},
        create: {
          userId: studentUser.id,
          courseId: course.id,
        },
      });

      const firstLecture = await prisma.lecture.findFirst({
        where: { courseId: course.id },
        orderBy: { orderIndex: 'asc' },
      });

      if (firstLecture) {
        const progress = await prisma.progress.upsert({
          where: {
            userId_courseId: {
              userId: studentUser.id,
              courseId: course.id,
            },
          },
          update: {
            lastWatchedLectureId: firstLecture.id,
            lastPlaybackTime: 120,
            progressPercentage: 33,
          },
          create: {
            userId: studentUser.id,
            courseId: course.id,
            lastWatchedLectureId: firstLecture.id,
            lastPlaybackTime: 120,
            progressPercentage: 33,
            isCompleted: false,
          },
        });

        await prisma.lectureCompletion.upsert({
          where: {
            progressId_lectureId: {
              progressId: progress.id,
              lectureId: firstLecture.id,
            },
          },
          update: {},
          create: {
            progressId: progress.id,
            lectureId: firstLecture.id,
          },
        });
      }

      console.log(`🎓 Enrolled Demo Student in ${course.title} with sample progress.`);
    }
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
