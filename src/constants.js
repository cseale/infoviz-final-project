// eslint-disable-next-line import/prefer-default-export
export const OUTFLOW = 'outflow';
export const INFLOW = 'inflow';
export const NETFLOW = 'netflow';

export const HOMICIDES = 'Intentional homicides (per 100,000 people)';
export const DEVELOPMENT_ASSISTANCE = 'development_assistance';
export const AQUACULTURE = 'Aquaculture production (metric tons)';
export const FISHERIES = 'Capture fisheries production (metric tons)';
export const TUBERCULOSIS = 'Incidence of tuberculosis (per 100,000 people)';
export const PRIMARY_EDUCATION = 'Primary education, duration (years)';
export const DEFACATION = 'People practicing open defecation (% of population)';
export const RENEWABLE_ENERGY = 'Renewable electricity output (% of total electricity output)';
export const DRINKING_WATER = 'People using at least basic drinking water services (% of population)';
export const ENERGY_CONSUMPTION = 'Renewable energy consumption (% of total final energy consumption)';
export const BASIC_SANIATION = 'People using at least basic sanitation services (% of population)';
export const URBAN_POPLUATION = 'Urban population (% of total)';
export const URBAN_POPLUATION_GROWTH = 'Urban population growth (annual %)';
export const COAL_RENTS = 'Coal rents (% of GDP)';
export const EXPORTS = 'Exports of goods and services (% of GDP)';
export const GDP_GROWTH = 'GDP growth (annual %)';
export const GDP_PER_CAPITA = 'GDP per capita (constant 2010 US$)';

export const FACTORS = [
  HOMICIDES,
  DEVELOPMENT_ASSISTANCE,
  AQUACULTURE,
  FISHERIES,
  TUBERCULOSIS,
  PRIMARY_EDUCATION,
  DEFACATION,
  RENEWABLE_ENERGY,
  DRINKING_WATER,
  ENERGY_CONSUMPTION,
  BASIC_SANIATION,
  URBAN_POPLUATION,
  URBAN_POPLUATION_GROWTH,
  COAL_RENTS,
  EXPORTS,
  GDP_GROWTH,
  GDP_PER_CAPITA,
].map(f => ({ name: f }));

export const DIVERGING_THEME = ['rgb(103,0,31)', 'rgb(178,24,43)', 'rgb(214,96,77)', 'rgb(244,165,130)', 'rgb(253,219,199)', 'rgb(247,247,247)', 'rgb(209,229,240)', 'rgb(146,197,222)', 'rgb(67,147,195)', 'rgb(33,102,172)', 'rgb(5,48,97)'];
