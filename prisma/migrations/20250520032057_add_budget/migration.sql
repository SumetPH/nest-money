-- CreateTable
CREATE TABLE "budget" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budgetAccount" (
    "budget_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,

    CONSTRAINT "budgetAccount_pkey" PRIMARY KEY ("budget_id","account_id")
);

-- CreateTable
CREATE TABLE "budgetCategory" (
    "budget_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "budgetCategory_pkey" PRIMARY KEY ("budget_id","category_id")
);

-- AddForeignKey
ALTER TABLE "budgetAccount" ADD CONSTRAINT "budgetAccount_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgetAccount" ADD CONSTRAINT "budgetAccount_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgetCategory" ADD CONSTRAINT "budgetCategory_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgetCategory" ADD CONSTRAINT "budgetCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
