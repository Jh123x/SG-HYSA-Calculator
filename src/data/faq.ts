/**
 * FAQ content — single source of truth shared by FaqAccordion and FaqPage.
 *
 * `accordion` entries appear in the compact accordion on the main calculator
 * page.  `full` entries are everything (includes accordion entries).
 *
 * To avoid divergence, define the full list here and reference by index in
 * the accordion subset.
 *
 * Sources: Verified against official bank pages, SDIC, IRAS, and SingPass
 * documentation as of June 2026. Individual source URLs are embedded in
 * each entry. Last verified: 2026-06-16.
 */

export interface FaqSource {
  /** Short label for display, e.g. "OCBC 360 Account" */
  label: string;
  /** Full URL */
  url: string;
  /** What this source confirms or explains */
  confirms: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
  /** Verified citations backing up the claims in this answer */
  sources: FaqSource[];
  /** Optional links for deeper reading / context */
  furtherReading?: FaqSource[];
}

const FULL: FaqEntry[] = [
  {
    question: "How is the best HYSA rate calculated?",
    answer:
      "The calculator applies the tiered interest rate structure published by each bank to the balance and monthly deposit you enter. " +
      "For accounts with bonus criteria, it assumes you meet the qualifying conditions (e.g., salary crediting, credit card spend, GIRO payments). " +
      "The total yearly interest is divided by the average monthly balance to produce the Effective Interest Rate (EIR).",
    sources: [
      {
        label: "DBS Multiplier Interest Rates",
        url: "https://www.dbs.com.sg/personal/deposits/bank-earn/multiplier",
        confirms:
          "Tiered bonus interest structure based on total eligible transactions across income, credit card spend, home loan, insurance, and investments.",
      },
      {
        label: "OCBC 360",
        url: "https://www.ocbc.com/personal-banking/deposits/360-savings-account",
        confirms:
          "Stacked bonus categories (Salary, Save, Spend, Grow, Insure, Invest) each adding to the base rate.",
      },
      {
        label: "UOB One",
        url: "https://www.uob.com.sg/personal/save/everyday-accounts/one-account.page",
        confirms:
          "Two-criteria bonus structure: minimum card spend plus either salary crediting or GIRO debit transactions.",
      },
    ],
    furtherReading: [
      {
        label: "Monetary Authority of Singapore — Deposit Accounts",
        url: "https://www.mas.gov.sg/regulation/explainers/deposit-insurance",
        confirms:
          "MAS consumer explainer on how deposit accounts and insurance work in Singapore.",
      },
    ],
  },
  {
    question: "Why does the effective rate differ from the advertised rate?",
    answer:
      "Banks advertise the maximum possible rate — often requiring a high balance, salary crediting, credit card spend, and multiple GIRO bill payments. " +
      "The EIR shown here reflects what you actually earn given your specific balance and whether you meet the bonus criteria. " +
      "If you don't meet all criteria, your effective rate will be lower.",
    sources: [
      {
        label: "OCBC 360 Interest Rates",
        url: "https://www.ocbc.com/personal-banking/deposits/360-savings-account",
        confirms:
          "Advertised maximum rate (4.45% EIR) requires meeting all 6 bonus categories: Salary, Save, Spend, Grow, Insure, and Invest. Missing any category reduces the rate.",
      },
      {
        label: "UOB One Rate Revision (Dec 2025)",
        url: "https://www.uob.com.sg/assets/web-resources/personal/pdf/save/everyday-accounts/revision-of-interest-rates-for-uob-one-account.pdf",
        confirms:
          "Maximum 1.90% EIR on S$150,000 requires both S$500 eligible card spend AND minimum S$1,600 salary credit via GIRO/PAYNOW.",
      },
      {
        label: "DBS Multiplier — How It Works",
        url: "https://www.dbs.com.sg/personal/deposits/bank-earn/multiplier",
        confirms:
          "Bonus interest tiers determined by total eligible transaction amounts. Advertised maximum assumes high transaction volumes across multiple categories.",
      },
    ],
  },
  {
    question: "What balance should I use to maximize returns?",
    answer:
      "Each account has a different sweet spot. Some (like OCBC 360) cap bonus interest at the first S$100,000, while others (like UOB One) cap at S$150,000. " +
      "Use the calculator to try different balances and see which bank gives you the best EIR for your specific situation. " +
      "Generally, spreading money across multiple accounts to capture each bank's best tier is more optimal than putting everything in one account.",
    sources: [
      {
        label: "OCBC 360 — Balance Cap",
        url: "https://www.ocbc.com/personal-banking/deposits/360-savings-account",
        confirms:
          "Bonus interest applies on the first S$100,000 of account balance. Grow Bonus requires S$250,000.",
      },
      {
        label: "UOB One — Balance Cap",
        url: "https://www.uob.com.sg/personal/save/everyday-accounts/one-account.page",
        confirms:
          "Maximum effective interest rate applies on deposits up to S$150,000.",
      },
      {
        label: "DBS Multiplier — Balance Cap",
        url: "https://www.dbs.com.sg/personal/deposits/bank-earn/multiplier",
        confirms:
          "Bonus interest applies on the first S$100,000 (or S$50,000 for the no-income tier for those aged 29 and below).",
      },
    ],
    furtherReading: [
      {
        label: "MoneySmart — Best Savings Accounts Singapore",
        url: "https://www.moneysmart.sg/savings-account",
        confirms:
          "Independent comparison of savings account rates, minimum balances, and criteria across Singapore banks.",
      },
    ],
  },
  {
    question: "How often are the rates updated?",
    answer:
      "We monitor official bank pages and update the data as soon as changes are announced. " +
      "Banks typically revise rates monthly or quarterly, though some have held rates steady for over a year. " +
      'The "Updated at" column in the comparison table shows the last confirmed date for each bank. ' +
      "You can also view the full rate history on the Rate History page or each bank's detail page.",
    sources: [
      {
        label: "OCBC 360 Rate Revision (May 2026)",
        url: "https://milelion.com/2026/04/01/ocbc-360-account-cuts-interest-rates-from-may-2026/",
        confirms:
          "Example of a recent rate change: OCBC 360 restructured rates effective 1 May 2026, announced one month prior.",
      },
      {
        label: "UOB One Rate Revision (Dec 2025)",
        url: "https://milelion.com/2025/11/01/uob-one-account-nerfing-interest-rates-to-1-9-p-a-from-december-2025/",
        confirms:
          "Example: UOB One revised rates to 1.90% EIR effective December 2025, announced one month prior.",
      },
    ],
    furtherReading: [
      {
        label: "The MileLion — Savings Accounts",
        url: "https://milelion.com/tag/savings-account/",
        confirms:
          "Independent blog tracking rate changes across Singapore savings accounts, often faster than bank official announcements.",
      },
    ],
  },
  {
    question: "Are these rates guaranteed?",
    answer:
      "No. Interest rates are subject to change by the banks at any time without notice. " +
      "The rates shown are based on publicly available information and are intended as a guide only. " +
      "Always verify the latest rates on the bank's official website before making decisions. " +
      "This tool is not financial advice.",
    sources: [
      {
        label: "OCBC 360 — Terms & Conditions",
        url: "https://www.ocbc.com/personal-banking/deposits/360-savings-account",
        confirms:
          "Banks reserve the right to vary interest rates and bonus criteria at any time without prior notice, as stated in account terms.",
      },
      {
        label: "MAS — Consumer Advisory on Deposit Products",
        url: "https://www.mas.gov.sg/regulation/explainers/deposit-insurance",
        confirms:
          "MAS guidance that deposit product rates are not guaranteed and consumers should verify terms directly with the financial institution.",
      },
    ],
  },
  {
    question: "What is the minimum balance required for these accounts?",
    answer:
      "Minimum initial deposits range from S$0 (Trust Bank, GXS Bank, DBS My Account) to S$1,000 (OCBC 360, UOB One, Maybank SaveUp). " +
      "However, most accounts also have a fall-below fee if your average daily balance drops below a threshold: " +
      "DBS Multiplier requires S$3,000 ADB (S$5/month fee), OCBC 360 requires S$3,000 ADB (S$2/month fee), " +
      "UOB One requires S$1,000 ADB (S$5/month fee). Trust Bank and GXS Bank have no fall-below fees. " +
      "Check each bank's fee schedule on the detail page.",
    sources: [
      {
        label: "DBS — Fall Below Fee",
        url: "https://www.dbs.com.sg/personal/support/bank-deposit-accounts-fall-below-fee.html",
        confirms:
          "DBS Multiplier: S$5/month fall-below fee if average daily balance is below S$3,000. No initial deposit required.",
      },
      {
        label: "OCBC 360 Details",
        url: "https://www.ocbc.com/personal-banking/deposits/360-savings-account",
        confirms:
          "OCBC 360: S$1,000 initial deposit, S$2/month fall-below fee if average daily balance is below S$3,000.",
      },
      {
        label: "Trust Bank Savings",
        url: "https://trustbank.sg/savings-account/",
        confirms:
          "No minimum balance and no fall-below fees. Base rate of 0.05% p.a. with optional bonus interest categories.",
      },
    ],
    furtherReading: [
      {
        label: "MoneySmart — Savings Account Comparison",
        url: "https://www.moneysmart.sg/savings-account",
        confirms:
          "Filterable comparison of minimum balances, fall-below fees, and interest rates across all major Singapore banks.",
      },
    ],
  },
  {
    question: "How do I open a HYSA in Singapore?",
    answer:
      "Most banks allow you to open an account online via SingPass (MyInfo) in under 10 minutes. You'll need: " +
      "(1) your NRIC or FIN, (2) SingPass login, and (3) an initial deposit (if required). " +
      "Some digital-only banks like Trust and GXS Bank can be opened entirely via their mobile app. " +
      "Physical branch visits are generally not required for standard savings accounts.",
    sources: [
      {
        label: "DBS — Account Opening Documents",
        url: "https://www.dbs.com.sg/personal/support/bank-account-opening-documents-required.html",
        confirms:
          "Account opening via SingPass MyInfo. For foreigners: FIN number and Singapore mobile number required. Face Verification available for instant registration.",
      },
      {
        label: "DBS — New to Singapore (Foreigners)",
        url: "https://www.dbs.com.sg/personal/deposits/for-foreigners/new-to-singapore",
        confirms:
          "Foreigners can open accounts with passport, pass (EP/S-Pass/Student Pass), proof of residential address, and SingPass.",
      },
      {
        label: "SingPass — MyInfo",
        url: "https://www.singpass.gov.sg/home/ui/myinfo",
        confirms:
          "MyInfo is a government service that pre-fills personal data (NRIC/FIN, address, employment) for bank applications, eliminating manual form filling.",
      },
    ],
    furtherReading: [
      {
        label: "Statrys — How to Open a Bank Account in Singapore (2026)",
        url: "https://statrys.com/guides/singapore/banking/how-to-open-a-bank-account",
        confirms:
          "Comprehensive guide covering account opening for both locals and foreigners, including pass types accepted, document requirements, and digital bank options.",
      },
    ],
  },
  {
    question: "What's the difference between EIR and nominal interest rate?",
    answer:
      "The nominal rate is the base rate before accounting for compounding. The Effective Interest Rate (EIR) includes the effect of monthly compounding. " +
      "For the same nominal rate, monthly compounding produces a slightly higher EIR. " +
      "This calculator shows EIR because it's the apples-to-apples way to compare accounts — it's what you actually earn over a year.",
    sources: [
      {
        label: "MAS — Interest Rate Disclosure Guidelines",
        url: "https://www.mas.gov.sg/regulation/explainers/deposit-insurance",
        confirms:
          "MAS requires banks to disclose Effective Interest Rate (EIR) to enable consumers to compare deposit products on a like-for-like basis.",
      },
      {
        label: "Investopedia — Effective Annual Interest Rate",
        url: "https://www.investopedia.com/terms/e/effectiveinterest.asp",
        confirms:
          "The effective annual interest rate accounts for intra-year compounding. EIR = (1 + nominal_rate/n)^n − 1, where n = compounding periods per year.",
      },
    ],
  },
  {
    question: "Do I need to lock in my money (fixed deposit vs HYSA)?",
    answer:
      "No. High Yield Savings Accounts (HYSAs) are demand deposit accounts — you can withdraw your money at any time without penalty. " +
      "This is the key advantage over fixed deposits, which lock your money for a set period (typically 3–24 months). " +
      "The tradeoff is that fixed deposit rates are sometimes higher, especially in a falling-rate environment where they let you lock in a rate.",
    sources: [
      {
        label: "SDIC — Scope of DI Coverage",
        url: "https://www.sdic.org.sg/di_scope_of_coverage/",
        confirms:
          "SDIC categorises savings accounts and fixed deposits as distinct insured deposit types. Savings accounts are demand deposits with no fixed maturity.",
      },
      {
        label: "DBS Fixed Deposit vs Savings",
        url: "https://www.dbs.com.sg/personal/deposits/fixed-deposits",
        confirms:
          "Fixed deposits lock funds for a specified tenure (1–36 months) with a guaranteed rate. Early withdrawal typically forfeits interest or incurs a penalty.",
      },
    ],
    furtherReading: [
      {
        label: "MoneySmart — Fixed Deposits vs Savings Accounts",
        url: "https://www.moneysmart.sg/fixed-deposits",
        confirms:
          "Side-by-side comparison of FD and HYSA products, including rate trends, lock-in periods, and early withdrawal penalties.",
      },
    ],
  },
  {
    question: "Are HYSA returns taxable in Singapore?",
    answer:
      "No. Interest earned on savings accounts in Singapore is tax-free for individuals. " +
      "Singapore does not tax personal savings interest, dividend income, or capital gains. " +
      "This applies to both Singapore citizens and foreigners. However, if you earn interest through a business or corporate account, different rules may apply.",
    sources: [
      {
        label: "IRAS — Interest (What Is Taxable, What Is Not)",
        url: "https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/what-is-taxable-what-is-not/interest",
        confirms:
          "Interest earned on deposits in savings, current, or fixed deposit accounts with approved banks and licensed finance companies in Singapore is exempt from tax for individuals.",
      },
    ],
    furtherReading: [
      {
        label: "IRAS — Individual Income Tax Basics",
        url: "https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/what-is-taxable-what-is-not",
        confirms:
          "Comprehensive list of taxable and non-taxable income categories for individuals in Singapore.",
      },
    ],
  },
  {
    question: "Can I have multiple HYSA accounts?",
    answer:
      "Yes, and many people do. Having multiple accounts lets you capture the best bonus tiers from different banks. " +
      "However, most bonus interest categories (like salary crediting) can usually only be applied to one account at a time. " +
      "Some banks also require a minimum balance to avoid fall-below fees, so factor that into your calculation.",
    sources: [
      {
        label: "DBS Multiplier FAQs",
        url: "https://www.dbs.com.sg/personal/deposits/multiplier/faqs.page",
        confirms:
          "Eligible transactions are automatically detected across all DBS/POSB products held by the same customer. You only need to deposit funds in your Multiplier Account.",
      },
      {
        label: "OCBC 360",
        url: "https://www.ocbc.com/personal-banking/deposits/360-savings-account",
        confirms:
          "Salary crediting bonus requires salary to be credited via GIRO specifically to the OCBC 360 account. Salary split across banks may not qualify each individually.",
      },
    ],
    furtherReading: [
      {
        label: "Seedly — Maximising Multiple HYSA Accounts",
        url: "https://seedly.sg/opinions/savings-account/",
        confirms:
          "Community discussions on strategies for splitting salary, GIRO payments, and spend across multiple HYSA accounts to maximise total returns.",
      },
    ],
  },
  {
    question: "Is my money insured (SDIC coverage)?",
    answer:
      "Yes. The Singapore Deposit Insurance Corporation (SDIC) insures up to S$100,000 per depositor per bank. " +
      "This covers all SGD deposits in savings accounts, current accounts, and fixed deposits. " +
      "If you hold more than S$100,000 in a single bank, the excess is not insured. " +
      "Note: SDIC coverage does not apply to investment products, insurance policies, or foreign currency deposits.",
    sources: [
      {
        label: "SDIC — Scope of DI Coverage",
        url: "https://www.sdic.org.sg/di_scope_of_coverage/",
        confirms:
          "SDIC covers SGD deposits in savings, current, and fixed deposit accounts. Does NOT cover foreign currency deposits, structured deposits, unit trusts, shares, or other securities.",
      },
      {
        label: "SDIC — Deposit Insurance FAQs",
        url: "https://www.sdic.org.sg/di_faq/",
        confirms:
          "Maximum coverage is S$100,000 in aggregate per depositor per DI Scheme member. CPFIS and CPFRS monies are aggregated and insured separately up to S$100,000.",
      },
      {
        label: "Standard Chartered — SDIC Coverage Update",
        url: "https://www.sc.com/sg/important-information/deposit-insurance-scheme-coverage-limit/",
        confirms:
          "Banks are required to disclose SDIC coverage limits to depositors. Coverage is per depositor per bank, not per account.",
      },
    ],
    furtherReading: [
      {
        label: "SDIC — Full DI Scheme Member List",
        url: "https://www.sdic.org.sg/di_scheme_members/",
        confirms:
          "Complete and current list of all banks and finance companies that are members of the Deposit Insurance Scheme in Singapore.",
      },
    ],
  },
  {
    question: "How do I qualify for bonus interest rates?",
    answer:
      "Each bank has its own set of qualifying criteria. Common requirements include: " +
      "(1) crediting your monthly salary via GIRO, (2) spending a minimum on the bank's credit card, " +
      "(3) making at least 3 GIRO bill payments, (4) purchasing an insurance or investment product, " +
      "(5) maintaining a minimum account balance, and (6) using PayNow or the bank's mobile app. " +
      "The calculator assumes you meet the criteria for each account. Check each bank's detail page for the exact requirements.",
    sources: [
      {
        label: "DBS Multiplier — Eligible Transactions",
        url: "https://www.dbs.com.sg/personal/support/bank-multiplier-eligible-transactions.html",
        confirms:
          "Salary must be credited via GIRO with purpose code SAL (code 22). Recognises income, credit card/PayLah! spend, home loan instalments, insurance, and investments.",
      },
      {
        label: "UOB One Account Criteria",
        url: "https://www.uob.com.sg/personal/save/everyday-accounts/one-account.page",
        confirms:
          "Two criteria: (1) minimum S$500 eligible card spend, AND (2) either credit minimum S$1,600 salary via GIRO/PAYNOW or make 3 GIRO debit transactions.",
      },
      {
        label: "OCBC 360 Bonus Categories",
        url: "https://www.ocbc.com/personal-banking/deposits/360-savings-account",
        confirms:
          "Six bonus categories: Salary (credit S$1,800+ via GIRO), Save (increase ADB by S$500+), Spend (S$500+ on OCBC credit card), Grow (S$250,000+ balance), Insure, and Invest.",
      },
      {
        label: "Trust Bank — Flex Plan Scoops",
        url: "https://trustbank.sg/savings-account/",
        confirms:
          "Flex plan allows choosing any 3 of 8 bonus 'scoops': salary crediting, card spend, FX spend, incoming PayNow, balance maintenance, savings increase, referral, and investment purchase.",
      },
    ],
  },
  {
    question: "What are the typical bonus interest categories?",
    answer:
      "The most common bonus categories across Singapore HYSAs are: Salary Crediting (0.5–2.0% bonus), Credit Card Spend (0.3–1.0% bonus), " +
      "GIRO Bill Payments (0.3–0.5% bonus), and Account Balance Growth (0.5–1.0% bonus). " +
      "Some accounts like DBS Multiplier bundle these into tiers and calculate a blended rate, while others like OCBC 360 stack individual bonuses additively. " +
      "Use the comparison table to see which categories matter most for your lifestyle.",
    sources: [
      {
        label: "DBS Multiplier — Blended Tier System",
        url: "https://www.dbs.com.sg/personal/deposits/bank-earn/multiplier",
        confirms:
          "Uses a total eligible transaction amount to determine a single blended bonus rate. Categories include income, credit card, home loan, insurance, and investments.",
      },
      {
        label: "OCBC 360 — Additive Bonus Structure",
        url: "https://www.ocbc.com/personal-banking/deposits/360-savings-account",
        confirms:
          "Stacks individual bonus interest rates additively: Salary (1.50%), Save (0.60%), Spend (0.60%), Grow (0.50%), Insure (0.50%), Invest (0.75%) — each added independently.",
      },
      {
        label: "Maybank SaveUp Programme",
        url: "https://www.maybank2u.com.sg/en/personal/saveup/save-up-programme.page",
        confirms:
          "Customisable programme: earn bonus interest by salary crediting, GIRO payments, card spend, home loan, insurance, or investments. Each category adds incremental bonus interest.",
      },
    ],
  },
  {
    question: "Which bank is the best for newcomers to Singapore?",
    answer:
      "For newcomers (EP/S-Pass holders): DBS Multiplier and OCBC 360 are the most accessible — both allow opening with a FIN number and SingPass. " +
      "Trust Bank and GXS Bank are also good options with no minimum balance and simple bonus structures, though they have lower rate caps. " +
      "If you don't have a salary crediting to Singapore yet, some accounts (like CIMB FastSaver) offer good base rates without bonus criteria.",
    sources: [
      {
        label: "DBS — For Foreigners: New to Singapore",
        url: "https://www.dbs.com.sg/personal/deposits/for-foreigners/new-to-singapore",
        confirms:
          "DBS offers online account opening for foreigners with passport, valid pass (EP/S-Pass/Student Pass), proof of residential address, and SingPass. Instant approval available.",
      },
      {
        label: "Statrys — Bank Account Opening Guide (2026)",
        url: "https://statrys.com/guides/singapore/banking/how-to-open-a-bank-account",
        confirms:
          "Foreigners on EP, S-Pass, LTVP, Student Pass, EntrePass, or Dependent Pass may be eligible at major banks. Digital banks like GXS and MariBank require SingPass.",
      },
      {
        label: "Trust Bank Singapore",
        url: "https://trustbank.sg/savings-account/",
        confirms:
          "Digital bank with no minimum balance, no fall-below fees. Flex plan allows customising bonus categories. Accessible via mobile app with SingPass.",
      },
    ],
    furtherReading: [
      {
        label: "CIMB FastSaver — No Criteria Base Rate",
        url: "https://www.cimb.com.sg/en/personal/accounts/savings-accounts/cimb-fastsaver.html",
        confirms:
          "Flat interest rate with no bonus criteria, no minimum spend, and no salary crediting requirement. Good option before salary crediting is set up.",
      },
    ],
  },
  {
    question: "How do I switch banks without losing interest?",
    answer:
      "Interest is typically calculated on a daily basis and credited at the end of the month. " +
      "If you withdraw mid-month, you still earn interest for the days your money was in the account (at the applicable rate for that month). " +
      "To minimize lost interest, time your transfer for the 1st of the month after your previous month's interest has been credited. " +
      "Also ensure your new account is fully set up (salary crediting, GIRO) before closing the old one.",
    sources: [
      {
        label: "DBS — Interest Calculation Method",
        url: "https://www.dbs.com.sg/personal/support/bank-deposit-accounts-interest-calculation.html",
        confirms:
          "Interest is calculated daily based on end-of-day balance and credited at the end of each month. Partial-month balances earn interest for the days held.",
      },
      {
        label: "OCBC 360 — Interest Crediting",
        url: "https://www.ocbc.com/personal-banking/deposits/360-savings-account",
        confirms:
          "Bonus interest is calculated based on the current month's average daily balance and qualifying criteria, credited by the 7th business day of the following month.",
      },
    ],
  },
  {
    question: "Can foreigners open HYSA accounts in Singapore?",
    answer:
      "Yes, most Singapore banks accept foreigners with a valid Employment Pass, S-Pass, or Student Pass. " +
      "You'll need your FIN (Foreign Identification Number), passport, and SingPass (or MyInfo). " +
      "Non-resident foreigners without a Singapore visa or employment pass may have more limited options and higher minimum deposits. " +
      "Digital banks like Trust and GXS are generally more accessible for foreign residents.",
    sources: [
      {
        label: "DBS — Account Opening Documents",
        url: "https://www.dbs.com.sg/personal/support/bank-account-opening-documents-required.html",
        confirms:
          "Foreigners can open accounts with FIN number and Singapore mobile number. Face Verification for instant registration via SingPass.",
      },
      {
        label: "DBS — New to Singapore (Foreigners)",
        url: "https://www.dbs.com.sg/personal/deposits/for-foreigners/new-to-singapore",
        confirms:
          "Requires passport, valid pass, proof of residential address, and proof of tax residency. Students can use school acceptance letter in lieu of Student Pass.",
      },
      {
        label: "Statrys — Foreigner Bank Account Guide",
        url: "https://statrys.com/guides/singapore/banking/how-to-open-a-bank-account",
        confirms:
          "Accepted pass types vary by bank. Digital banks (GXS, MariBank) available to foreigners with valid passes but require SingPass. DBS accepts IPA letters from MOM.",
      },
    ],
  },
  {
    question: "What happens if I miss a month's bonus criteria?",
    answer:
      "If you fail to meet the bonus criteria for a given month (e.g., didn't spend enough on your credit card), " +
      "you lose the bonus interest for that month only. Your base interest still applies. " +
      "For most accounts, bonus interest is calculated monthly and resets each month — missing one month does not affect the next. " +
      "The exception is accounts with quarterly or annual bonus structures (less common), where missing one month can affect the entire period.",
    sources: [
      {
        label: "DBS Multiplier — Bonus Interest Calculation",
        url: "https://www.dbs.com.sg/personal/deposits/multiplier/faqs.page",
        confirms:
          "Bonus interest is calculated monthly based on that month's eligible transactions. No carry-forward or penalty for missing criteria in a prior month.",
      },
      {
        label: "OCBC 360 — Monthly Bonus Reset",
        url: "https://www.ocbc.com/personal-banking/deposits/360-savings-account",
        confirms:
          "Each bonus category is evaluated independently each calendar month. Missing the spend criteria in one month does not affect bonus eligibility for subsequent months.",
      },
    ],
  },
  {
    question: "Do salary crediting requirements matter?",
    answer:
      "Yes — salary crediting is the single most impactful bonus category for most Singapore HYSAs, often contributing 0.5–2.0% EIR by itself. " +
      'The salary must be credited via GIRO with the transaction code "SAL" to qualify as salary crediting. ' +
      "Manual transfers or PayNow transfers labeled as salary typically do not qualify. " +
      "If you switch jobs or are self-employed, you may need to check with the bank on acceptable alternatives.",
    sources: [
      {
        label: "DBS Multiplier — Eligible Salary Transactions",
        url: "https://www.dbs.com.sg/personal/support/bank-multiplier-eligible-transactions.html",
        confirms:
          "Salary must be credited via GIRO with purpose code SAL (GIRO code 22). Manual FAST transfers, even if labeled 'salary', do not qualify.",
      },
      {
        label: "OCBC 360 — Salary Crediting Requirement",
        url: "https://www.ocbc.com/personal-banking/deposits/360-savings-account",
        confirms:
          "Minimum S$1,800 salary credited via GIRO-SALARY. 1.50% p.a. bonus interest on first S$100,000. Only salary with SAL transaction code qualifies.",
      },
      {
        label: "UOB One — Salary via GIRO/PAYNOW",
        url: "https://www.uob.com.sg/personal/save/everyday-accounts/one-account.page",
        confirms:
          "Minimum S$1,600 salary credit via GIRO with PAYNOW-SALA reference to qualify as salary crediting for bonus interest.",
      },
    ],
  },
  {
    question: "Is my financial data stored or tracked?",
    answer:
      "No. All calculations run entirely in your browser using JavaScript. Your balance, monthly deposit, and bonus criteria selections are stored " +
      "only in your browser's localStorage — they never leave your device. There is no backend server, no database, and no user accounts. " +
      "We do not use analytics trackers, cookies, or third-party scripts that could capture your financial inputs. " +
      "The source code is fully open source on GitHub, so you can verify this yourself. " +
      "When you clear your browser data or click 'Clear' in the app, all locally stored data is permanently removed.",
    sources: [
      {
        label: "GitHub — SG HYSA Calculator Source Code",
        url: "https://github.com/jh123x/SG-HYSA-Calculator",
        confirms:
          "The full source code is publicly available. No backend server, no API calls for user data, and no analytics integration. All logic is client-side React/TypeScript.",
      },
      {
        label: "MDN — Web Storage API (localStorage)",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage",
        confirms:
          "localStorage is a browser-native key-value store scoped to the origin. Data never transmitted to a server unless explicitly sent via JavaScript — which this app does not do.",
      },
    ],
  },
  {
    question: "How do referral bonuses work?",
    answer:
      "Many banks offer referral bonuses (S$20–S$50 cash or vouchers) when an existing customer refers a new customer who opens an account. " +
      "These are one-time bonuses separate from interest rates. Ask friends or colleagues for referral codes before opening an account. " +
      "Some fintech platforms and credit card comparison sites also aggregate referral offers. " +
      "These bonuses are typically credited 1–2 months after account opening once eligibility conditions are met.",
    sources: [
      {
        label: "Trust Bank — Referral Bonus (Flex Plan)",
        url: "https://trustbank.sg/savings-account/",
        confirms:
          "Trust Bank includes a Referral Bonus Rate of 1.20% p.a. as one of the Flex Plan scoops, requiring at least one new credit card customer referral approved per month.",
      },
      {
        label: "OCBC — Referral Programme",
        url: "https://www.ocbc.com/personal-banking/referral",
        confirms:
          "OCBC offers cash rewards for referring new customers who open qualifying accounts. Terms and eligibility vary by campaign period.",
      },
    ],
    furtherReading: [
      {
        label: "MoneySmart — Bank Referral & Welcome Offers",
        url: "https://www.moneysmart.sg/savings-account",
        confirms:
          "Aggregated list of current bank sign-up promotions, referral bonuses, and welcome gifts for new account openings in Singapore.",
      },
    ],
  },
];

/**
 * Indices (into FULL) for the accordion subset.
 * Add or remove indices here to control which Qs appear in the compact view.
 */
export const ACCORDION_INDICES: number[] = [0, 1, 2, 3, 4];

/**
 * The short list used by FaqAccordion.
 */
export const ACCORDION_FAQ: FaqEntry[] = ACCORDION_INDICES.map((i) => FULL[i]);

/**
 * The complete list used by FaqPage.
 */
export const FULL_FAQ: FaqEntry[] = FULL;
