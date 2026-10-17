TEMPLATE FOR RETROSPECTIVE (Team 1)
===================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs done


  |  #stories committed  |    #stories done     |
  |      :---------:     |     :---------:      |
  |           2          |          2           |

- Total points committed vs done

  |  #points committed   |     #points done    |
  |      :---------:     |     :---------:     |
  |           8          |         8           |

- Nr of hours planned vs spent (as a team)

  |  #hours planned      |      #hours spent   |
  |      :---------:     |     :---------:     |
  |         57h 30m      |        64h          |


**Remember**  a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on Git
- End-to-End tests performed



### Detailed statistics


| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  | 6       | -      | 27h 30m    | 30h          |
| #1    | 8       | 3      | 12h 30m    | 17h 50m      |
| #2    | 9       | 5      | 17h 30m    | 18h 45m      |


- Hours per task average, standard deviation (estimate and actual)


  |            | Mean   | StDev  |
  | ---------- | ------ | ------ |
  | Estimation | 2h 30m | 2h 16m |
  | Actual     | 2h 50m | 2h 21m |

- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

  $$
  rac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1
  $$
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

  $$
  rac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right|
  $$

  |  Total estimation error ratio      |      Absolute relative task estimation error  |
  |      :---------:     |     :---------:     |
  |         0.13      |        0.28          |


## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated: **4**
  - Total hours spent: **3h 30m**
  - Nr of automated unit test cases: **7**
  - Coverage: **39%**
- E2E testing:
  - Total hours estimated: **4**
  - Total hours spent: **4h**
  - Nr of test cases: **11**
- Code review
  - Total hours estimated: **4h**
  - Total hours spent: **6h 45m**

## ASSESSMENT

- What caused your errors in estimation (if any)?

  - Inexperience
  - Mismanagment of time
  - We divided the work in tasks that were too big (more than 2 hours)
  - Reworking tasks more than once

- What lessons did you learn (both positive and negative) in this sprint?

  - Time management
  - Communication
  - Task division
- Which improvement goals set in the previous retrospective were you able to achieve?
  
    *not applicable*
- Which ones you were not able to achieve? Why?

    *not applicable*

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  - Streamline communication
  - Better deadline management (internal, weighted reliance )

- One thing you are proud of as a Team!!

  - We delivered everything that we planned to.
