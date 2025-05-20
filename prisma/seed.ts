import { PrismaClient, CategoryType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const typeList = [
    {
      id: 1,
      title: 'ยอดเริ่มต้น',
    },
    {
      id: 2,
      title: 'รายจ่าย',
    },
    {
      id: 3,
      title: 'รายรับ',
    },
    {
      id: 4,
      title: 'โอนจาก',
    },
    {
      id: 5,
      title: 'โอนไป',
    },
    {
      id: 6,
      title: 'ชำระหนี้สิน',
    },
    {
      id: 7,
      title: 'ให้ยืม',
    },
    {
      id: 8,
      title: 'ใช้คืน (ที่ให้ยืม)',
    },
  ];

  for (const type of typeList) {
    await prisma.type.upsert({
      where: {
        id: type.id,
      },
      create: {
        id: type.id,
        title: type.title,
      },
      update: {},
    });
  }

  const categoryList = [
    {
      id: 1,
      title: 'Subscription',
      type: CategoryType.expense,
    },
    {
      id: 2,
      title: 'ใช้จ่าย',
      type: CategoryType.expense,
    },
    {
      id: 3,
      title: 'ผ่อนชำระ',
      type: CategoryType.expense,
    },
    {
      id: 4,
      title: 'อาหาร',
      type: CategoryType.expense,
    },
    {
      id: 5,
      title: 'เงินเดือน',
      type: CategoryType.income,
    },
    {
      id: 6,
      title: 'บ้าน',
      type: CategoryType.expense,
    },
    {
      id: 7,
      title: 'ค่าเน็ต',
      type: CategoryType.expense,
    },
    {
      id: 8,
      title: 'ค่าไฟ',
      type: CategoryType.expense,
    },
    {
      id: 9,
      title: 'อื่นๆ',
      type: CategoryType.income,
    },
    {
      id: 10,
      title: 'พิเศษ',
      type: CategoryType.expense,
    },
    {
      id: 11,
      title: 'เครื่องแต่งกาย',
      type: CategoryType.expense,
    },
    {
      id: 12,
      title: 'เกมส์',
      type: CategoryType.expense,
    },
    {
      id: 13,
      title: 'หนังสือ',
      type: CategoryType.expense,
    },
    {
      id: 14,
      title: 'การลงทุน',
      type: CategoryType.income,
    },
    {
      id: 15,
      title: 'บริจาค',
      type: CategoryType.expense,
    },
    {
      id: 16,
      title: 'รถ',
      type: CategoryType.expense,
    },
    {
      id: 17,
      title: 'ขายของ',
      type: CategoryType.income,
    },
    {
      id: 18,
      title: 'ให้ยืม',
      type: CategoryType.expense,
    },
    {
      id: 19,
      title: 'ใช้คืน',
      type: CategoryType.income,
    },
    {
      id: 20,
      title: 'ลอตเตอรี่',
      type: CategoryType.expense,
    },
    {
      id: 21,
      title: 'ของขวัญ',
      type: CategoryType.income,
    },
    {
      id: 22,
      title: 'ดอกเบี้ย',
      type: CategoryType.income,
    },
    {
      id: 23,
      title: 'การศึกษา',
      type: CategoryType.expense,
    },
    {
      id: 24,
      title: 'ค่ารักษาพยาบาล',
      type: CategoryType.expense,
    },
    {
      id: 25,
      title: 'น้ำมัน',
      type: CategoryType.expense,
      parent_id: 16,
    },
    {
      id: 26,
      title: 'เครื่องดื่ม',
      type: CategoryType.expense,
      parent_id: 4,
    },
  ];

  for (const category of categoryList) {
    await prisma.category.upsert({
      where: {
        id: category.id,
      },
      create: {
        id: category.id,
        title: category.title,
        type: category.type,
        parent_id: category.parent_id,
      },
      update: {},
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
