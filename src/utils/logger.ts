const logColors = {
	PURPLE: '\u001b[34m',
	GREEN: '\x1b[32m',
	RED: '\x1b[31m',
	RESET: '\x1b[0m',
	YELLOW: '\x1b[33m',
};

export class Logger {
	private static now(): string {
		const now = new Intl.DateTimeFormat('pt-BR', {
			dateStyle: 'short',
			timeStyle: 'medium',
			timeZone: 'America/Sao_Paulo',
		}).format(new Date()) as string;

		return `${logColors.PURPLE}[${now}]${logColors.RESET}`;
	}

	public static setTo(className: string): Logger {
		return new Logger(className);
	}

	private constructor(private className: string) {}

	public error(message: string): void {
		console.error(
			`${Logger.now()} ${logColors.RED}[ERROR] ${this.className}${
				logColors.RESET
			} ${message}`,
		);
	}

	public info(message: string): void {
		console.info(
			`${Logger.now()} ${logColors.GREEN}[INFO] ${this.className}${
				logColors.RESET
			} ${message}`,
		);
	}

	public warn(message: string): void {
		console.warn(
			`${Logger.now()} ${logColors.YELLOW}[WARN]  ${this.className}${
				logColors.RESET
			} ${message}`,
		);
	}
}
