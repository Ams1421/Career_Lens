using CareerLens.Domain.Entities;
using CareerLens.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace CareerLens.API.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(CareerLensDbContext context)
    {
        await context.Database.MigrateAsync();

        // =========================================================
        // Seed Master Skills (Insert only missing skills)
        // =========================================================

        var skills = new[]
        {
            // FRONTEND
            "HTML","HTML5","CSS","CSS3","SASS","SCSS","JavaScript","TypeScript",
            "React","Next.js","Vue.js","Nuxt.js","Angular","Svelte","SvelteKit",
            "Redux","Redux Toolkit","React Router","Tailwind CSS","Bootstrap",
            "Material UI","Chakra UI","Shadcn UI","Webpack","Vite",

            // BACKEND
            ".NET",".NET Core","ASP.NET","ASP.NET Core","ASP.NET MVC",
            "Entity Framework","Entity Framework Core","C#","Java","Spring",
            "Spring Boot","Spring Security","Hibernate","Node.js","Express.js",
            "NestJS","Python","Django","Flask","FastAPI","PHP","Laravel",
            "Ruby","Ruby on Rails","Go","Gin","Rust","Kotlin","GraphQL","REST API",

            // DATABASES
            "SQL","PostgreSQL","MySQL","SQL Server","Oracle","SQLite","MariaDB",
            "MongoDB","Redis","Firebase","Firestore","DynamoDB","Cassandra",
            "Supabase","Neo4j",

            // CLOUD
            "AWS","Azure","Google Cloud","Azure Functions","AWS Lambda","EC2","S3",
            "CloudFront","Vercel","Netlify","Render","Railway","Heroku",
            "DigitalOcean","Cloudflare",

            // DEVOPS
            "Git","GitHub","GitLab","Bitbucket","Docker","Docker Compose",
            "Kubernetes","Helm","Jenkins","GitHub Actions","Azure DevOps",
            "Terraform","Ansible","CI/CD","Linux","Ubuntu","Bash",
            "PowerShell","Nginx","Apache",

            // AI / MACHINE LEARNING
            "Artificial Intelligence","Machine Learning","Deep Learning",
            "Generative AI","Prompt Engineering","LLM","RAG","LangChain",
            "OpenAI API","TensorFlow","PyTorch","Keras","Scikit-learn",
            "OpenCV","Computer Vision","NLP","NumPy","Pandas","Matplotlib",
            "Seaborn","XGBoost","LightGBM","Hugging Face","Transformers",
            "Stable Diffusion","YOLO","MLOps","Model Deployment",
            "Feature Engineering","Data Preprocessing",

            // DATA ENGINEERING
            "Apache Spark","Hadoop","Kafka","Airflow","ETL","Data Warehouse",
            "Snowflake","BigQuery","Databricks","Apache Hive","Apache Flink","dbt",

            // DATA ANALYTICS
            "Power BI","Tableau","Excel","Advanced Excel","Data Analysis",
            "Data Visualization","Statistics","Business Intelligence",
            "Dashboard Design","DAX",

            // MOBILE
            "Flutter","React Native","Android","Android Studio","Kotlin",
            "Java Android","Swift","iOS",

            // TESTING
            "JUnit","NUnit","xUnit","Jest","Vitest","Cypress","Playwright",
            "Selenium","Postman","Swagger","Unit Testing","Integration Testing",

            // UI/UX
            "Figma","Adobe XD","Canva","UI Design","UX Design","Wireframing",
            "Prototyping","Design Systems",

            // CYBERSECURITY
            "OAuth","JWT","Authentication","Authorization","OWASP",
            "Cyber Security","Penetration Testing","Network Security",
            "Encryption","Identity Management",

            // PROJECT MANAGEMENT
            "Agile","Scrum","Kanban","Jira","Confluence","SDLC",
            "Project Management","Requirement Analysis"
        };

        var existingSkills = await context.Skills
            .Select(s => s.Name)
            .ToListAsync();

        var newSkills = skills
            .Except(existingSkills, StringComparer.OrdinalIgnoreCase)
            .Select(name => new Skill
            {
                Name = name,
                CreatedAtUtc = DateTime.UtcNow
            })
            .ToList();

        if (newSkills.Any())
        {
            context.Skills.AddRange(newSkills);
            await context.SaveChangesAsync();
        }

        // =========================================================
        // Prevent duplicate Company & Job seeding
        // =========================================================

        if (await context.Companies.AnyAsync())
            return;

        var companies = new List<Company>
        {
            new()
            {
                Name = "TechNova Pvt Ltd",
                Description = "Software Development Company",
                Industry = "Software",
                WebsiteUrl = "https://technova.com",
                HeadquartersLocation = "Hyderabad",
                IsVerified = true,
                IsActive = true
            },
            new()
            {
                Name = "CareerLens",
                Description = "AI Career Intelligence Platform",
                Industry = "Technology",
                WebsiteUrl = "https://careerlens.ai",
                HeadquartersLocation = "Remote",
                IsVerified = true,
                IsActive = true
            },
            new()
            {
                Name = "Infosys",
                Description = "IT Services Company",
                Industry = "IT Services",
                WebsiteUrl = "https://infosys.com",
                HeadquartersLocation = "Bengaluru",
                IsVerified = true,
                IsActive = true
            },
            new()
            {
                Name = "TCS",
                Description = "Technology Consulting",
                Industry = "Technology",
                WebsiteUrl = "https://tcs.com",
                HeadquartersLocation = "Hyderabad",
                IsVerified = true,
                IsActive = true
            },
            new()
            {
                Name = "Deloitte",
                Description = "Consulting Services",
                Industry = "Consulting",
                WebsiteUrl = "https://deloitte.com",
                HeadquartersLocation = "Chennai",
                IsVerified = true,
                IsActive = true
            }
        };

        context.Companies.AddRange(companies);
        await context.SaveChangesAsync();

        var jobs = new List<Job>
        {
            new()
            {
                CompanyId = companies[0].Id,
                Title = "Frontend Developer",
                Description = "Build React applications for enterprise clients.",
                Requirements = "React, JavaScript, HTML, CSS",
                Responsibilities = "Develop UI components",
                Location = "Hyderabad",
                EmploymentType = "Full Time",
                WorkMode = "Hybrid",
                MinimumSalary = 500000,
                MaximumSalary = 800000,
                Currency = "INR",
                ApplicationDeadlineUtc = DateTime.UtcNow.AddMonths(1),
                IsActive = true,
                IsVerified = true
            },
            new()
            {
                CompanyId = companies[1].Id,
                Title = "Full Stack Developer",
                Description = "Work on CareerLens platform.",
                Requirements = ".NET, React, PostgreSQL",
                Responsibilities = "Develop frontend and backend",
                Location = "Remote",
                EmploymentType = "Full Time",
                WorkMode = "Remote",
                MinimumSalary = 600000,
                MaximumSalary = 900000,
                Currency = "INR",
                ApplicationDeadlineUtc = DateTime.UtcNow.AddMonths(1),
                IsActive = true,
                IsVerified = true
            },
            new()
            {
                CompanyId = companies[2].Id,
                Title = "React Developer",
                Description = "Build scalable web applications.",
                Requirements = "React, TypeScript",
                Responsibilities = "Develop reusable components",
                Location = "Bengaluru",
                EmploymentType = "Full Time",
                WorkMode = "Hybrid",
                MinimumSalary = 450000,
                MaximumSalary = 700000,
                Currency = "INR",
                ApplicationDeadlineUtc = DateTime.UtcNow.AddMonths(1),
                IsActive = true,
                IsVerified = true
            },
            new()
            {
                CompanyId = companies[3].Id,
                Title = ".NET Developer",
                Description = "Develop enterprise APIs.",
                Requirements = ".NET Core, SQL",
                Responsibilities = "Build backend services",
                Location = "Hyderabad",
                EmploymentType = "Full Time",
                WorkMode = "Onsite",
                MinimumSalary = 550000,
                MaximumSalary = 850000,
                Currency = "INR",
                ApplicationDeadlineUtc = DateTime.UtcNow.AddMonths(1),
                IsActive = true,
                IsVerified = true
            },
            new()
            {
                CompanyId = companies[4].Id,
                Title = "Data Analyst",
                Description = "Analyze business data.",
                Requirements = "SQL, Power BI, Excel",
                Responsibilities = "Create dashboards",
                Location = "Chennai",
                EmploymentType = "Full Time",
                WorkMode = "Hybrid",
                MinimumSalary = 500000,
                MaximumSalary = 750000,
                Currency = "INR",
                ApplicationDeadlineUtc = DateTime.UtcNow.AddMonths(1),
                IsActive = true,
                IsVerified = true
            }
        };

        context.Jobs.AddRange(jobs);
        await context.SaveChangesAsync();
    }
}