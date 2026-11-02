# Probability model

## Combat rules

- Attacking army counts include the one army that must remain in the origin territory.
- Attackers roll 1–3 dice, limited to their army count minus one. Defenders roll 1–2 dice,
  limited to their army count. Both players choose before either rolls.
- Dice are independent, fair six-sided dice. Sort each side highest first and compare up to
  the smaller dice count. Each comparison removes one army; the defender wins ties.
- A battle ends at zero defenders (conquest) or one attacker (resistance). Zero initial defenders
  is treated as an already conquered territory, including when only one attacker remains.

## Individual rolls

`rollDistribution(a, d)` enumerates all `6^(a+d)` ordered dice outcomes and groups them by losses.
`conditionalRoll(values, d)` fixes the known attacker values and enumerates `6^d` defender outcomes.
The latter is hypothetical analysis, never a reason to choose defense after seeing the attacker roll.

Reference counts below are grouped by **attacker armies lost**, not by the number of dice rolled:

| Attack / defend dice | Lose 0 | Lose 1 | Lose 2 | Total outcomes |
| -------------------- | -----: | -----: | -----: | -------------: |
| 1 / 1                |     15 |     21 |      0 |             36 |
| 1 / 2                |     55 |    161 |      0 |            216 |
| 2 / 1                |    125 |     91 |      0 |            216 |
| 2 / 2                |    295 |    420 |    581 |           1296 |
| 3 / 1                |    855 |    441 |      0 |           1296 |
| 3 / 2                |   2890 |   2611 |   2275 |           7776 |

Defender losses equal `min(a, d) - attacker losses`. Expected casualties are the sum of each loss
count multiplied by its probability. The UI shows both marginal casualty distributions; they
describe the same roll and are not independent events.

## Territorial battles

`battle(A, D)` assumes maximum legal dice on every roll. Let an outcome remove `x` attacking armies
and `y` defending armies with probability `p(x, y)`. The conquest probability is:

```text
P(A, 0) = 1
P(1, D) = 0 for D > 0
P(A, D) = sum p(x, y) * P(A - x, D - y)
```

Expected attacker losses use `sum p(x, y) * (x + E_A(A - x, D - y))`; defender losses use the same
recurrence with `y`. Terminal expectations are zero. Loss expectations include both successful
and failed attacks, rather than being conditional on conquest.

Each transition removes at least one army, so the state graph has no cycles. Memoization reuses
smaller battles and needs at most `O(A * D)` states. Public inputs are bounded to 200 armies per
side to keep synchronous work and cached state bounded on mobile devices.

## Strategy scope

`strategy(A, D)` evaluates every legal **opening** dice pair, followed by maximum-dice play for
every later roll. It exposes conquest, resistance, immediate expected losses, and total expected
losses for each opening.

- The attack recommendation maximizes the worst conquest chance across legal defending choices.
- The defense recommendation independently maximizes the worst resistance chance across legal
  attacking choices.
- Equal success chances within numerical tolerance favor more dice.

These are pre-roll, pure-choice maximin recommendations under the stated continuation model, not
a full minimax or mixed-strategy solution for every future turn. The main forecast always uses
maximum dice, even if an alternative opening is selected by the recommendation procedure.

Minimizing immediate losses is a different objective from keeping or conquering a territory.
For example, defending with two dice against three exposes the defender to more immediate expected
casualties than using one die, but can improve the chance of keeping the territory. The comparison
table makes both objectives visible instead of ranking choices by the chance of any casualty.

## Numerical presentation and verification

Enumeration uses integer counts, with probabilities and dynamic-programming expectations evaluated
in double precision. The model is exact combinatorial enumeration, not arbitrary-precision rational
arithmetic. Probability estimates do not use Monte Carlo sampling.

Percentages are shown to one decimal. A largest-remainder allocation rounds complete probability
partitions together so they total 100.0%; expected casualties are shown to two decimals. Displayed
0.0% and 100.0% can be rounded values rather than mathematical certainty.

Tests cover all reference distributions above, ties, conditional/unconditional consistency,
probability normalization, independently expanded small battles, casualty bounds, opening-choice
consistency, input validation, terminal states, and the maximum supported army counts.

## Dice roll simulator

The simulator generates a single illustrative roll using `Math.random`, independently of the
territory army inputs. Each side chooses its dice count before rolling. It sorts both sets of dice
and uses `compareDice` to calculate casualties, including the defender's advantage on ties. Any
extra dice beyond the smaller dice count are displayed but not compared.

The displayed pre-roll probabilities use `rollDistribution` and exhaustive enumeration, not the
simulated result or repeated random samples. A single roll does not change those probabilities or
the territorial battle forecast.
