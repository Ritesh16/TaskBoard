using System;
using System.Collections.Generic;
using System.Text;

namespace TaskBoard.Dto
{
    public record ScheduleCheckResult(bool IsTaskDue, DateTime? ScheduledDate);
}
