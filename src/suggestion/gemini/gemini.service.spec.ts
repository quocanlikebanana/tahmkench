import { Test, TestingModule } from "@nestjs/testing";
import { GeminiService } from "./gemini.service";
import { ConfigModule } from "@nestjs/config";
import * as fs from 'fs';
import * as mime from 'mime-types';

describe('GeminiService', () => {
	let service: GeminiService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule.forRoot({
			})],
			providers: [GeminiService],
		}).compile();

		service = module.get<GeminiService>(GeminiService);
	});

	it.skip('should be defined', () => {
		expect(service).toBeDefined();
	});

	it.skip('should suggest next test title', async () => {
		const recentTitles = ["React.js", "Next.js", "TypeScript"];
		const suggestion = await service.nextTestTitleSuggestion(recentTitles);
		expect(suggestion).toBeDefined();
		expect(typeof suggestion).toBe('string');
		console.log("Suggested Title:", suggestion);
	});

	it.skip('should suggest tags for a test title', async () => {
		const testTitle = "Understanding React Hooks";
		const existingTags = ["react", "hooks"];
		const suggestion = await service.tagsSuggestion(testTitle, existingTags);
		expect(suggestion).toBeDefined();
		console.log("Suggested Tags:", suggestion);
		console.log("Type of Suggested Tags:", typeof suggestion);
		console.log("Is Suggested Tags an Array?", Array.isArray(suggestion));
	});

	it.skip('should extract job description from PDF (English)', async () => {
		const pdf1 = await fs.promises.readFile(__dirname + '/__test__/jd1.pdf');
		const file = new Blob([pdf1], { type: 'application/pdf' });

		console.log("PDF File Size (MB):", file.size / (1024 * 1024));

		const description = await service.pdfJobDescriptionExtract(file);
		expect(description).toBeDefined();
		expect(typeof description).toBe('string');
		console.log("Extracted Job Description:", description);
	});

	it.skip('should extract job description from PDF (Vietnamese)', async () => {
		const pdf2 = await fs.promises.readFile(__dirname + '/__test__/jd2.pdf');
		const file = new Blob([pdf2], { type: 'application/pdf' });

		console.log("PDF File Size (MB):", file.size / (1024 * 1024));

		const description = await service.pdfJobDescriptionExtract(file);
		expect(description).toBeDefined();
		console.log("Extracted Job Description:", description);
	});

	it.skip('should extract job description from image (English)', async () => {
		const filePath = __dirname + '/__test__/jd_img1.png';
		const image = await fs.promises.readFile(filePath);

		const fileType = mime.lookup(filePath) || 'image/png';
		const file = new Blob([image], { type: fileType });

		console.log("Image File Type:", file.type);
		console.log("Image File Size (MB):", file.size / (1024 * 1024));

		const description = await service.imageJobDescriptionExtract(file);
		expect(description).toBeDefined();
		console.log("Extracted Job Description from Image:", description);
	});

	it.skip('should extract job description from image (Vietnamese)', async () => {
		const filePath = __dirname + '/__test__/jd_img2.jpg';
		const image = await fs.promises.readFile(filePath);

		const fileType = mime.lookup(filePath) || 'image/png';
		const file = new Blob([image], { type: fileType });

		console.log("Image File Type:", file.type);
		console.log("Image File Size (MB):", file.size / (1024 * 1024));

		const description = await service.imageJobDescriptionExtract(file);
		expect(description).toBeDefined();
		console.log("Extracted Job Description from Image:", description);
	});

	it('should extract job description from text', async () => {
		const text = `
		About the job
JOB DESCRIPTION: 

Work with international customers and colleagues from Germany, France, the Czech Republic, and the US
Independent conception and implementation of new functions in complex application landscapes
Coding in the frontend and backend, mainly with Java and JavaScript
Creation of technical documentation
** Working location: 195A Hai Ba Trung, Vo Thi Sau Ward, District 3, Ho Chi Minh City **

Please send us your application in English.
This job is open to both Vietnamese citizens and foreigners living in Vietnam.


YOUR SKILLS AND EXPERIENCE

General qualifications

Strong English communication skills (both verbal & written)
2+ years of professional experience in international software projects (flexible depending on how fast your learning and technical developing capabilities are)
Degree in engineering or natural sciences (university or technical college)
Technical skills

**Must have

Understanding of software development tools, processes, and architecture
In-depth understanding of in HTML/CSS, JavaScript
Experience in frontend frameworks such as ReactJS, Angular, VueJS...
Experience with multi-tier or service-oriented web applications
Experience with Java/Kotlin and J2EE frameworks such as Spring
Experience with relational databases, SQL, and ORM technologies
**Nice to have

Professional experience in the implementation of complex applications
Professional experience in ReactJS and its ecosystem 
Experience with TypeScript, Redux
Experience with build tools: Gradle, Maven, Webpack...
Experience with search engines such as Lucence, Solr, Elasticsearch...
Experience in testing practices and tools
Experience in microservices architect
Experience in agile software development
Proficient understanding of code versioning tools (Git is preferred)
Soft skills

Sense of responsibility, communication skills, and team spirit
Willingness to learn and build a deep understanding
Be able to work independently and under pressure
A passion for software development, new trends, and technologies in IT
Please send us you application in English.

WHY YOU'LL LOVE WORKING HERE

Good salary and a bonus if things work well 
Working & growing with an international team
Onsite opportunities: short-term and long-term assignments in Europe
18 days off allowance per year 
Premium insurance for you and your family member (spouse/ parent/ children) & yearly check-up
Loyalty program after three years and five years
Flexible working time (40h/week) with Hybrid working policy: open for good reasons and subject to prior requesting.
Highly professional equipment (Mac/Thinkpad, 2 screens, adjustable desks)
Intense English course for the first 3 months by our native English teachers and Optional English seminars during the work time
Training sponsored by mgm
An amazing company trip once a year, team-building with the project team and month-end with the whole company, covered by mgm
Free in-house entertainment facilities (darts, piano, climbing wall), drinks (coffee, beer, soft drinks,…) and food (cookies, fruit,…) and out-house company-funded sport clubs (football, swimming, badminton...)


APPLY NOW!
		`;
		const description = await service.textJobDescriptionExtract(text);
		expect(description).toBeDefined();
		console.log("Extracted Job Description from Text:", description);
	});
});
