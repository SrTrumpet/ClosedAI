import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GradeEntity } from './entities/grade.entity';
import { CreateGradeDto } from './dto/createGrade.dto';
import { UpdateGradeDto } from './dto/updateGrade.dto';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(GradeEntity)
    private gradeRepository: Repository<GradeEntity>,
  ) {}

  async createGrade(createGradeDto: CreateGradeDto): Promise<GradeEntity> {
    const grade = this.gradeRepository.create(createGradeDto);
    return await this.gradeRepository.save(grade);
  }

  async findGradeById(id: number): Promise<GradeEntity | undefined> {
    return await this.gradeRepository.findOne({ where: { id } });
  }

  async findGradesByStudentId(studentId: number): Promise<GradeEntity[]> {
    return await this.gradeRepository.find({ where: { studentId } });
  }

   // Nuevo método para obtener las notas por subjectId
   async findGradesBySubjectId(subjectId: number): Promise<GradeEntity[]> {
    return await this.gradeRepository.find({ where: { subjectId } });
  }

    async findGradesByStudentIdAndSubjectId(studentId: number, subjectId: number): Promise<GradeEntity[]> {
    return await this.gradeRepository.find({ where: { studentId, subjectId } });
    }

  // Método para actualizar una nota
  async updateGrade(id: number, updateGradeDto: UpdateGradeDto): Promise<GradeEntity> {
    const grade = await this.gradeRepository.findOne({ where: { id } });

    if (!grade) {
      throw new Error(`Grade with id ${id} not found`);
    }

    // Actualizar las propiedades de la calificación
    Object.assign(grade, updateGradeDto);

    return await this.gradeRepository.save(grade);
  }

  // Método para eliminar una calificación
  async deleteGrade(id: number): Promise<boolean> {
    const grade = await this.gradeRepository.findOne({ where: { id } });

    if (!grade) {
      throw new Error(`Grade with id ${id} not found`);
    }

    await this.gradeRepository.delete(id);
    return true; // Retorna un booleano indicando que se eliminó exitosamente
  }

  async getAllGrades(): Promise<GradeEntity[]> {
    return await this.gradeRepository.find(); // Devuelve todas las calificaciones
  }

}
