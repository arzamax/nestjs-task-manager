import { EntityRepository, Repository } from 'typeorm'

import { Task } from './task.entity'
import { CreateTaskDto, GetTasksFilterDto } from './dto'
import { ETaskStatus } from './task-status.enum'

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(getTasksFilterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = getTasksFilterDto
    const query = this.createQueryBuilder('task')

    if (status) {
      query.andWhere('task.status = :status', { status })
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
        )
    }

    return await query.getMany()
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto
    const task = new Task()

    task.title = title
    task.description = description
    task.status = ETaskStatus.open

    await task.save()
    return task
  }
}
