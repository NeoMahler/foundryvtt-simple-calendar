/**
 * @jest-environment jsdom
 */
import "../../__mocks__/game";
import "../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/handlebars";
import "../../__mocks__/event";
import "../../__mocks__/crypto";
import SimpleCalendar from "./simple-calendar";
import Year from "./year";
import Month from "./month";
import Moon from "./moon";
import {LeapYearRules, MoonIcons, MoonYearResetOptions} from "../constants";

describe('Moon Tests', () => {
    let m :Moon;

    beforeEach(() => {
        m = new Moon("Moon", 29.5);
    });

    test('Properties', () => {
        expect(Object.keys(m).length).toBe(6); //Make sure no new properties have been added
        expect(m.name).toBe('Moon');
        expect(m.cycleLength).toBe(29.5);
        expect(m.cycleDayAdjust).toBe(0);
        expect(m.color).toBe('#ffffff');
        expect(m.phases.length).toBe(1);
        expect(m.firstNewMoon).toStrictEqual({ "day": 1, "month": 1, "year": 0, "yearReset": "none", "yearX": 0 });
    });

    test('Clone', () => {
        expect(m.clone()).toStrictEqual(m);
    });

    test('To Template', () => {
        const y = new Year(0);
        let c = m.toTemplate(y);
        expect(Object.keys(c).length).toBe(7); //Make sure no new properties have been added
        expect(m.name).toBe('Moon');
        expect(m.cycleLength).toBe(29.5);
        expect(m.firstNewMoon).toStrictEqual({ "day": 1, "month": 1, "year": 0, "yearReset": "none", "yearX": 0 });
        expect(m.phases.length).toBe(1);
        expect(m.color).toBe('#ffffff');
        expect(m.cycleDayAdjust).toBe(0);
        expect(c.dayList).toStrictEqual([]);

        SimpleCalendar.instance = new SimpleCalendar();

        c = m.toTemplate(y);
        expect(c.dayList.length).toStrictEqual(0);
        y.months.push(new Month("Month 1", 1, 0, 10));
        c = m.toTemplate(y);
        expect(c.dayList.length).toStrictEqual(10);
    });

    test('Update Phase Length', () => {
        m.updatePhaseLength();
        expect(m.phases[0].length).toBe(1);

        m.phases.push({name: 'p2', icon: MoonIcons.NewMoon, length: 0, singleDay: false});
        m.updatePhaseLength();
        expect(m.phases[0].length).toBe(1);
        expect(m.phases[1].length).toBe(28.5);
    });

    test('Get Moon Phase', () => {
        const y = new Year(0);
        m.phases.push({name: 'p2', icon: MoonIcons.NewMoon, length: 0, singleDay: false});
        m.updatePhaseLength();
        expect(m.getMoonPhase(y)).toStrictEqual(m.phases[0]);
        y.months.push(new Month("Month 1", 1, 0, 10));
        y.months[0].current = true;
        expect(m.getMoonPhase(y)).toStrictEqual(m.phases[0]);
        y.months[0].days[2].current = true;
        expect(m.getMoonPhase(y)).toStrictEqual(m.phases[1]);

        m.firstNewMoon.yearReset = MoonYearResetOptions.LeapYear;
        expect(m.getMoonPhase(y)).toStrictEqual(m.phases[1]);
        y.leapYearRule.rule = LeapYearRules.Gregorian;
        expect(m.getMoonPhase(y)).toStrictEqual(m.phases[1]);
        y.numericRepresentation = 1990;
        expect(m.getMoonPhase(y)).toStrictEqual(m.phases[1]);

        m.firstNewMoon.yearReset = MoonYearResetOptions.XYears;
        expect(m.getMoonPhase(y)).toStrictEqual(m.phases[0]);
        m.firstNewMoon.yearX = 5;
        expect(m.getMoonPhase(y)).toStrictEqual(m.phases[1]);

        y.months[0].visible = true;
        expect(m.getMoonPhase(y, 'visible', {numericRepresentation: 2, name: "2", current: false, selected: false})).toStrictEqual(m.phases[1]);

        expect(m.getMoonPhase(y, 'selected')).toStrictEqual(m.phases[0]);
    });
});
