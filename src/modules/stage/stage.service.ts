import { Injectable } from '@nestjs/common'

/** 14阶段定义（与前端stages.ts保持一致） */
const STAGES = [
  { id: 'egg', name: '卵期', juniorName: '蚕卵期', minDays: 8, maxDays: 12, color: '#8B6914', icon: '🥚' },
  { id: 'instar_1', name: '一龄蚕（蚁蚕）', juniorName: '小蚁蚕', minDays: 3, maxDays: 4, color: '#A8D5A2', icon: '🐛' },
  { id: 'molt_1', name: '一眠', juniorName: '第一次睡觉', minDays: 1, maxDays: 1, color: '#A8D5A2', icon: '💤' },
  { id: 'instar_2', name: '二龄蚕', juniorName: '二龄蚕宝宝', minDays: 3, maxDays: 4, color: '#7BC06E', icon: '🐛' },
  { id: 'molt_2', name: '二眠', juniorName: '第二次睡觉', minDays: 1, maxDays: 1, color: '#7BC06E', icon: '💤' },
  { id: 'instar_3', name: '三龄蚕', juniorName: '三龄蚕宝宝', minDays: 3, maxDays: 4, color: '#5AA04E', icon: '🐛' },
  { id: 'molt_3', name: '三眠', juniorName: '第三次睡觉', minDays: 1, maxDays: 1.5, color: '#5AA04E', icon: '💤' },
  { id: 'instar_4', name: '四龄蚕', juniorName: '四龄大蚕', minDays: 4, maxDays: 5, color: '#3D8B3D', icon: '🐛' },
  { id: 'molt_4', name: '四眠', juniorName: '最后一次睡觉', minDays: 1, maxDays: 2, color: '#3D8B3D', icon: '💤' },
  { id: 'instar_5', name: '五龄蚕', juniorName: '最大蚕宝宝', minDays: 6, maxDays: 8, color: '#2D6B2D', icon: '🐛' },
  { id: 'cocoon', name: '结茧', juniorName: '蚕宝宝盖房子', minDays: 2, maxDays: 3, color: '#D4A843', icon: '🪹' },
  { id: 'pupa', name: '蛹期', juniorName: '茧里的魔法', minDays: 10, maxDays: 14, color: '#C68E3A', icon: '🔮' },
  { id: 'moth', name: '蚕蛾出茧', juniorName: '蚕蛾出来啦', minDays: 1, maxDays: 1, color: '#E8E0D8', icon: '🦋' },
  { id: 'lay_eggs', name: '交配产卵', juniorName: '蚕蛾生宝宝', minDays: 3, maxDays: 7, color: '#8B6914', icon: '🥚' },
]

@Injectable()
export class StageService {
  getAllStages() {
    return STAGES
  }

  getStageById(stageId: string) {
    return STAGES.find(s => s.id === stageId)
  }

  /** 根据开始日期计算当前阶段 */
  calculateCurrentStage(startDate: Date, targetDate: Date = new Date()) {
    const totalDays = Math.max(0, Math.round((targetDate.getTime() - startDate.getTime()) / 86400000))

    let remainingDays = totalDays
    let currentStage = STAGES[0]
    let dayInStage = 0

    for (const stage of STAGES) {
      const midDays = Math.round((stage.minDays + stage.maxDays) / 2)
      if (remainingDays <= midDays) {
        currentStage = stage
        dayInStage = remainingDays
        break
      }
      remainingDays -= midDays
    }

    return { currentStage, dayInStage, totalDays }
  }
}
