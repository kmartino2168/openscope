import ava from 'ava';

import AircraftTypeDefinitionModel from '../../src/assets/scripts/client/aircraft/AircraftTypeDefinitionModel';
import { AIRCRAFT_DEFINITION_MOCK } from './_mocks/aircraftMocks';

ava('throws when passed invalid parameters', (t) => {
    t.throws(() => new AircraftTypeDefinitionModel());
    t.throws(() => new AircraftTypeDefinitionModel([]));
    t.throws(() => new AircraftTypeDefinitionModel({}));
    t.throws(() => new AircraftTypeDefinitionModel(42));
    t.throws(() => new AircraftTypeDefinitionModel('threeve'));
    t.throws(() => new AircraftTypeDefinitionModel(false));
});

ava('does not throw when passed valid parameters', (t) => {
    t.notThrows(() => new AircraftTypeDefinitionModel(AIRCRAFT_DEFINITION_MOCK));
});

ava('._buildTypeForStripView() returns the icao when not a heavy/super weightclass', (t) => {
    const model = new AircraftTypeDefinitionModel(AIRCRAFT_DEFINITION_MOCK);
    const result = model._buildTypeForStripView();

    t.true(result === 'B737/L');
});

ava('._buildTypeForStripView() returns the correct string for H weightclass', (t) => {
    const model = new AircraftTypeDefinitionModel(AIRCRAFT_DEFINITION_MOCK);
    model.weightclass = 'H';
    const result = model._buildTypeForStripView();

    t.true(result === 'H/B737/L');
});

ava('._buildTypeForStripView() returns the correct string for S weightclass', (t) => {
    const model = new AircraftTypeDefinitionModel(AIRCRAFT_DEFINITION_MOCK);
    model.weightclass = 'U';
    const result = model._buildTypeForStripView();

    t.true(result === 'H/B737/L');
});

ava('.isHeavyOrSuper() returns true when `#weightclass` is `H`', (t) => {
    const model = new AircraftTypeDefinitionModel(AIRCRAFT_DEFINITION_MOCK);
    model.weightclass = 'H';

    t.true(model.isHeavyOrSuper());
});

ava('.isHeavyOrSuper() returns true when `#weightclass` is `S`', (t) => {
    const model = new AircraftTypeDefinitionModel(AIRCRAFT_DEFINITION_MOCK);
    model.weightclass = 'U';

    t.true(model.isHeavyOrSuper());
});

ava('.isHeavyOrSuper() returns false when `#weightclass` is not `H` or `S`', (t) => {
    const model = new AircraftTypeDefinitionModel(AIRCRAFT_DEFINITION_MOCK);
    model.weightclass = 'S';

    t.false(model.isHeavyOrSuper());
});

ava('.calculateSameRunwaySeparationDistanceInFeet() returns the correct distance as long as the previous aircraft is not a srs category 3', (t) => {
    const model = new AircraftTypeDefinitionModel(AIRCRAFT_DEFINITION_MOCK);
    const previousModel = new AircraftTypeDefinitionModel(AIRCRAFT_DEFINITION_MOCK);
    previousModel.category.srs = 1;
    model.category.srs = 1;

    let distance = model.calculateSameRunwaySeparationDistanceInFeet(previousModel);

    t.true(distance === 3000);

    model.category.srs = 2;
    distance = model.calculateSameRunwaySeparationDistanceInFeet(previousModel);

    t.true(distance === 4500);

    model.category.srs = 3;
    distance = model.calculateSameRunwaySeparationDistanceInFeet(previousModel);

    t.true(distance === 6000);
});

ava('.calculateSameRunwaySeparationDistanceInFeet() returns 6000ft when the previous aircraft has no srs category or is srs category 3', (t) => {
    const model = new AircraftTypeDefinitionModel(AIRCRAFT_DEFINITION_MOCK);
    const previousModel = new AircraftTypeDefinitionModel(AIRCRAFT_DEFINITION_MOCK);
    model.category.srs = undefined;
    previousModel.category.srs = undefined;

    let distance = model.calculateSameRunwaySeparationDistanceInFeet(previousModel);

    t.true(distance === 6000);

    previousModel.category.srs = 3;
    distance = model.calculateSameRunwaySeparationDistanceInFeet(previousModel);

    t.true(distance === 6000);
});
