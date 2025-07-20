import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError } from "axios";

const MAIN_BACKEND_URL = 'https://skillsharp-api.icu';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly httpService: HttpService,
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = request.headers.authorization?.split(' ')[1];

		if (!token) {
			return false;
		}

		const response = await firstValueFrom(this.httpService.post<{
			isValid: boolean;
			userId: string | null;
			roleId: string | null;
		}>(
			`${MAIN_BACKEND_URL}/thresh/auth/verify`,
			{
				token
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				}
			}
		).pipe(
			catchError((error: AxiosError) => {
				throw new Error(`Token verification failed: ${error.message}`);
			})
		))

		const { isValid, userId, roleId } = response.data;

		if (!isValid || !userId || !roleId) {
			return false;
		}
		return true;
	}
}