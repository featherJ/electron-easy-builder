import { error, info } from "utils/log";
import chalk from 'chalk';

/** 一个任务 */
export interface ITask {
    /**
     * 任务名
     */
    readonly name: string;
    /**
     * 初始化该任务
     * @param args 
     * @returns 
     */
    init(...args: any[]): void;
    /**
     * 运行
     * @return 是否运行成功，true为成功，false为失败
     */
    run(): Promise<boolean>;
}


/**
 * 任务基类
 */
export abstract class TaskBase {
    private _name: string;
    public get name(): string {
        return this._name;
    }
    constructor(name: string) {
        this._name = name;
    }
}

/**
 * 运行一个任务
 * @param task
 * @returns 是否运行成功，true为成功，false为失败
 */
export async function runTask(task: ITask): Promise<boolean> {
    info(`${chalk.blue(task.name)} starting...`)
    try {
        let success = await task.run();
        info(`${chalk.blue(task.name)} completed.`)
        return success;
    } catch (e) {
        error(e)
    }
    return false;
}

/**
 * 运行一组任务，如果中间有任务失败则中断所有任务
 * @param tasks 
 * @returns 
 */
export async function runTasks(tasks: ITask[]): Promise<boolean> {
    for (var i = 0; i < tasks.length; i++) {
        let curTask = tasks[i];
        let success = await runTask(curTask);
        if (!success) {
            return false;
        }
    }
    return true;
}

