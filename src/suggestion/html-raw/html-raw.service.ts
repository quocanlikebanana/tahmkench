import { Injectable } from "@nestjs/common";
import axios from "axios";


@Injectable()
export class HtmlRawService {
	async getHtmlFromUrl(url: string): Promise<string> {
		const response = await axios.get(url, {
			responseType: 'text',
		});
		return response.data;
	}
}