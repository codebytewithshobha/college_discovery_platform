import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import {
  INDIAN_CITIES,
  formatLocation,
  type IndianCity,
} from '../lib/india-locations'

const prisma = new PrismaClient()

const METRO_CITIES = new Set([
  'Mumbai',
  'Delhi',
  'New Delhi',
  'Bangalore',
  'Chennai',
  'Hyderabad',
  'Kolkata',
  'Pune',
])

function collegeNameForCity({ city, state }: IndianCity, index: number): string {
  const templates = [
    `${city} Institute of Technology`,
    `${city} College of Engineering`,
    `${state} University - ${city} Campus`,
    `Government Engineering College, ${city}`,
  ]
  return templates[index % templates.length]
}

const courseNames = [
  'Computer Science Engineering',
  'Electronics and Communication Engineering',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Aerospace Engineering',
  'Biotechnology',
  'Information Technology',
  'Artificial Intelligence',
  'Data Science',
  'Cyber Security',
  'Software Engineering',
  'Robotics',
  'Automobile Engineering',
]

const recruiters = [
  'Google',
  'Microsoft',
  'Amazon',
  'Meta',
  'Apple',
  'TCS',
  'Infosys',
  'Wipro',
  'HCL',
  'Cognizant',
  'Accenture',
  'Deloitte',
  'PwC',
  'Ernst & Young',
  'KPMG',
  'Goldman Sachs',
  'JPMorgan Chase',
  'Morgan Stanley',
  'McKinsey',
  'Boston Consulting Group',
  'Bain & Company',
  'Flipkart',
  'Swiggy',
  'Zomato',
  'Paytm',
  'PhonePe',
  'Razorpay',
  'BYJUs',
  'Oyo',
  'Ola',
  'Uber',
  'Adobe',
  'Salesforce',
  'Oracle',
  'SAP',
  'IBM',
  'Intel',
  'NVIDIA',
  'AMD',
  'Qualcomm',
  'Texas Instruments',
  'Cisco',
  'Juniper',
  'VMware',
  'Red Hat',
]

const reviewComments = [
  'Excellent faculty and great infrastructure. The college provides wonderful opportunities for overall development.',
  'Good placements and industry exposure. The curriculum is up-to-date with current industry trends.',
  'Amazing campus life with lots of extracurricular activities. The hostel facilities are top-notch.',
  'Strong academic programs with experienced professors. The research facilities are impressive.',
  'Great value for money. The fees are reasonable compared to the quality of education provided.',
  'The college has a strong alumni network which helps in placements and internships.',
  'Good balance between academics and sports. The sports facilities are excellent.',
  'The library is well-stocked with the latest books and journals. Very helpful for research.',
  'The college organizes various technical festivals and cultural events throughout the year.',
  'Industry collaborations provide good internship opportunities. Practical exposure is excellent.',
]

const descriptions = [
  'A premier institution known for its excellence in technical education and research. The college offers state-of-the-art facilities and world-class faculty.',
  'One of the leading educational institutions in the country with a strong focus on innovation and entrepreneurship. The campus is equipped with modern laboratories and research centers.',
  'A renowned university with a rich legacy of academic excellence. The institution is committed to providing quality education and fostering holistic development.',
  'An institution dedicated to nurturing talent and building future leaders. The college offers a wide range of programs across various disciplines.',
  'A center of excellence in education and research. The institution is known for its strong industry connections and excellent placement record.',
]

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@collegehub.com' },
    update: {},
    create: {
      email: 'admin@collegehub.com',
      name: 'Admin User',
      password: hashedPassword,
    },
  })
  console.log('✅ Created admin user')

  // Reset colleges so re-seed reflects latest city coverage
  await prisma.college.deleteMany()
  console.log('🗑️  Cleared existing colleges')

  const colleges = []
  let collegeIndex = 0

  for (const cityEntry of INDIAN_CITIES) {
    const collegesPerCity = METRO_CITIES.has(cityEntry.city) ? 3 : 2

    for (let i = 0; i < collegesPerCity; i++) {
      const name = collegeNameForCity(cityEntry, i)
      const location = formatLocation(cityEntry)
      const establishmentYear = 1950 + Math.floor(Math.random() * 70)
      const rating = 3 + Math.random() * 2
      const fees = 50000 + Math.floor(Math.random() * 400000)
      const averagePackage = 500000 + Math.floor(Math.random() * 1500000)
      const highestPackage = averagePackage + Math.floor(Math.random() * 2000000)
      const ranking = collegeIndex < 50 ? collegeIndex + 1 : null

      const college = await prisma.college.create({
        data: {
          name,
          location,
          description: descriptions[collegeIndex % descriptions.length],
          establishmentYear,
          ranking,
          rating: parseFloat(rating.toFixed(1)),
          fees,
          averagePackage,
          highestPackage,
          thumbnail: null,
          website: `https://www.example.com`,
        },
      })
      colleges.push(college)
      collegeIndex++
    }
  }
  console.log(`✅ Created ${colleges.length} colleges across ${INDIAN_CITIES.length} cities`)

  // Helper function to add delay
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  // Create courses in smaller batches with delays
  let courseCount = 0
  for (let i = 0; i < colleges.length; i++) {
    const college = colleges[i]
    const numCourses = 2 + Math.floor(Math.random() * 3) // 2-4 courses
    const usedCourses = new Set<string>()
    const coursesData = []

    for (let j = 0; j < numCourses; j++) {
      let courseName
      do {
        courseName = courseNames[Math.floor(Math.random() * courseNames.length)]
      } while (usedCourses.has(courseName))
      usedCourses.add(courseName)

      const courseType = ['UNDERGRADUATE', 'POSTGRADUATE', 'PHD'][Math.floor(Math.random() * 3)]
      const courseDuration = ['FOUR_YEARS', 'TWO_YEARS', 'THREE_YEARS'][Math.floor(Math.random() * 3)]
      const courseFees = college.fees * (0.8 + Math.random() * 0.4)

      coursesData.push({
        name: courseName,
        type: courseType,
        duration: courseDuration,
        fees: Math.floor(courseFees),
        collegeId: college.id,
      })
    }

    if (coursesData.length > 0) {
      await prisma.course.createMany({
        data: coursesData,
      })
      courseCount += coursesData.length
    }

    // Add small delay every 20 colleges to prevent connection pool exhaustion
    if ((i + 1) % 20 === 0) {
      await delay(100)
    }
  }
  console.log(`✅ Created ${courseCount} courses`)
  await delay(200)

  // Create recruiters in smaller batches with delays
  let recruiterCount = 0
  for (let i = 0; i < colleges.length; i++) {
    const college = colleges[i]
    const numRecruiters = 2 + Math.floor(Math.random() * 3) // 2-4 recruiters
    const usedRecruiters = new Set<string>()
    const recruitersData = []

    for (let j = 0; j < numRecruiters; j++) {
      let recruiterName
      do {
        recruiterName = recruiters[Math.floor(Math.random() * recruiters.length)]
      } while (usedRecruiters.has(recruiterName))
      usedRecruiters.add(recruiterName)

      recruitersData.push({
        name: recruiterName,
        collegeId: college.id,
      })
    }

    if (recruitersData.length > 0) {
      await prisma.recruiter.createMany({
        data: recruitersData,
      })
      recruiterCount += recruitersData.length
    }

    // Add small delay every 20 colleges
    if ((i + 1) % 20 === 0) {
      await delay(100)
    }
  }
  console.log(`✅ Created ${recruiterCount} recruiters`)
  await delay(200)

  // Create reviews in smaller batches with delays
  let reviewCount = 0
  for (let i = 0; i < colleges.length; i++) {
    const college = colleges[i]
    const numReviews = 2 + Math.floor(Math.random() * 4) // 2-5 reviews
    const reviewsData = []

    for (let j = 0; j < numReviews; j++) {
      const rating = 3 + Math.floor(Math.random() * 3)
      const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)]
      const reviewerName = `Student ${j + 1}`

      reviewsData.push({
        reviewerName,
        rating,
        comment,
        collegeId: college.id,
        userId: admin.id,
      })
    }

    if (reviewsData.length > 0) {
      await prisma.review.createMany({
        data: reviewsData,
      })
      reviewCount += reviewsData.length
    }

    // Add small delay every 20 colleges
    if ((i + 1) % 20 === 0) {
      await delay(100)
    }
  }
  console.log(`✅ Created ${reviewCount} reviews`)

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
