export default abstract class SubCommand {
	public abstract exec: (...args: any[]) => Promise<any>;
}
