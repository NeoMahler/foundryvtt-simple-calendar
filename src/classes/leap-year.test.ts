/**
 * @jest-environment jsdom
 */
import "../../__mocks__/game";
import "../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/handlebars";
import "../../__mocks__/event";
import "../../__mocks__/crypto";
import LeapYear from "./leap-year";
import {LeapYearRules} from "../constants";
import Mock = jest.Mock;

describe('Leap Year Tests', () => {
    let lr: LeapYear;

    beforeEach(() => {
        lr = new LeapYear();
    });

    test('Properties', () => {
        expect(Object.keys(lr).length).toBe(2); //Make sure no new properties have been added
        expect(lr.rule).toBe(LeapYearRules.None);
        expect(lr.customMod).toBe(0);
    });

    test('Load From Settings', () => {
        (<Mock>game.settings.get).mockReturnValueOnce({rule: 'custom', customMod: 4});
        lr.loadFromSettings();
        expect(lr.rule).toBe(LeapYearRules.Custom);
        expect(lr.customMod).toBe(4);

        (<Mock>game.settings.get).mockReturnValueOnce(false);
        lr.loadFromSettings();
        expect(lr.rule).toBe(LeapYearRules.Custom);
        expect(lr.customMod).toBe(4);

        (<Mock>game.settings.get).mockReturnValueOnce({});
        lr.loadFromSettings();
        expect(lr.rule).toBe(LeapYearRules.Custom);
        expect(lr.customMod).toBe(4);
    });

    test('Is Leap Year', () => {
        expect(lr.isLeapYear(2020)).toBe(false);

        lr.rule = LeapYearRules.Gregorian;
        expect(lr.isLeapYear(2020)).toBe(true);
        expect(lr.isLeapYear(2021)).toBe(false);
        expect(lr.isLeapYear(1900)).toBe(false);
        expect(lr.isLeapYear(2000)).toBe(true);
        expect(lr.isLeapYear(0)).toBe(true);
        expect(lr.isLeapYear(4)).toBe(true);
        expect(lr.isLeapYear(8)).toBe(true);

        lr.rule = LeapYearRules.Custom;
        lr.customMod = 5;
        expect(lr.isLeapYear(2021)).toBe(false);
        expect(lr.isLeapYear(2020)).toBe(true);
        expect(lr.isLeapYear(0)).toBe(true);
        expect(lr.isLeapYear(5)).toBe(true);
        expect(lr.isLeapYear(8)).toBe(false);
    });

    test('How Many Leap Years', () => {
        expect(lr.howManyLeapYears(2020)).toBe(0);

        lr.rule = LeapYearRules.Gregorian;
        expect(lr.howManyLeapYears(0)).toBe(0);
        expect(lr.howManyLeapYears(4)).toBe(0);
        expect(lr.howManyLeapYears(5)).toBe(1);
        expect(lr.howManyLeapYears(8)).toBe(1);
        expect(lr.howManyLeapYears(9)).toBe(2);
        expect(lr.howManyLeapYears(2020)).toBe(489);
        expect(lr.howManyLeapYears(2021)).toBe(490);

        lr.rule = LeapYearRules.Custom;
        expect(lr.howManyLeapYears(0)).toBe(0);
        expect(lr.howManyLeapYears(4)).toBe(0);
        expect(lr.howManyLeapYears(2020)).toBe(0);
        expect(lr.howManyLeapYears(2021)).toBe(0);

        lr.customMod = 5;
        expect(lr.howManyLeapYears(0)).toBe(0);
        expect(lr.howManyLeapYears(5)).toBe(0);
        expect(lr.howManyLeapYears(6)).toBe(1);
        expect(lr.howManyLeapYears(2020)).toBe(403);
        expect(lr.howManyLeapYears(2021)).toBe(404);
    });

    test('Previous Leap Year', () => {
        expect(lr.previousLeapYear(1990)).toBe(null);
        lr.rule = LeapYearRules.Gregorian;
        expect(lr.previousLeapYear(1990)).toBe(1988);
    });

    test('Fraction', () => {
        expect(lr.fraction(1990)).toBe(0);
        lr.rule = LeapYearRules.Gregorian;
        expect(lr.fraction(1990)).toBe(0.5);
        lr.rule = LeapYearRules.Custom;
        lr.customMod = 5;
        expect(lr.fraction(1991)).toBe(0.2);

        lr.customMod = 0;
        expect(lr.fraction(1990)).toBe(0);
    });
});
