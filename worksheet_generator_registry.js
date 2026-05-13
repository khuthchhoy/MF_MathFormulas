
import { arithmetic } from './worksheet_generator_arithmetic.js';
import { algebra } from './worksheet_generator_algebra.js';
import { trigonometry } from './worksheet_generator_trigonometry.js';
import { limit } from './worksheet_generator_limit.js';
import { derivative } from './worksheet_generator_derivative.js';
import { integral } from './worksheet_generator_integral.js';
import { sequences } from './worksheet_generator_sequences.js';
import { series } from './worksheet_generator_series.js';

export const ProblemRegistry = {
    arithmetic,
    algebra,
    trigonometry,
    limit,
    derivative,
    integral,
    sequences,
    series
};