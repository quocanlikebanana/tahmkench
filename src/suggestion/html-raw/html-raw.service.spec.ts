import { Test, TestingModule } from "@nestjs/testing";
import { HtmlRawService } from "./html-raw.service";

describe('HtmlRawService', () => {
	let service: HtmlRawService;

	beforeEach(async () => {
		const testModule: TestingModule = await Test.createTestingModule({
			providers: [HtmlRawService],
		}).compile();

		service = testModule.get<HtmlRawService>(HtmlRawService);
	});

	it.skip('should be defined', () => {
		expect(service).toBeDefined();
	});

	it.skip('should return raw HTML from a URL', async () => {
		const url = 'https://example.com';
		const html = await service.getHtmlFromUrl(url);
		expect(html).toBeDefined();
		console.log("Raw HTML:", html);
	});

	it.skip('should handle invalid URL gracefully', async () => {
		const invalidUrl = 'invalid-url';
		await expect(service.getHtmlFromUrl(invalidUrl)).rejects.toThrow();
	});

	it('should fetch from Linkedin', async () => {
		const url = 'https://www.linkedin.com/jobs/collections/recommended/?currentJobId=4253382748';
		const html = await service.getHtmlFromUrl(url);
		console.log("HTML Length:", html.length);
		console.log("HTML Content:", html);
	});
});