/**
 * @jest-environment jsdom
 */
import "../../__mocks__/game";
import "../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/handlebars";
import "../../__mocks__/event";
import "../../__mocks__/crypto";
import "../../__mocks__/dialog";
import SimpleCalendar from "./simple-calendar";
import {LeapYearRules} from "../constants";
import Year from "./year";
import SpyInstance = jest.SpyInstance;
import Month from "./month";
import Macros from "./macros";
import Mock = jest.Mock;

describe('Macros Tests', () => {
    let y: Year;
    let renderSpy: SpyInstance;

    beforeEach(()=>{
        //Spy on console.error calls
        jest.spyOn(console, 'error').mockImplementation();
        //Set up a new Simple Calendar instance
        SimpleCalendar.instance = new SimpleCalendar();
        //Spy on the inherited render function of the new instance
        renderSpy = jest.spyOn(SimpleCalendar.instance, 'render');
        renderSpy.mockClear();
        (<Mock>console.error).mockClear();
        y = new Year(0);
        y.months.push(new Month('M', 1, 0, 5));
        y.months.push(new Month('T', 2, 0, 15));
        y.selectedYear = 0;
        y.visibleYear = 0;
        y.months[0].current = true;
        y.months[0].selected = true;
        y.months[0].visible = true;
        y.months[0].days[0].current = true;
        y.months[0].days[0].selected = true;
    });

    test('Macro Show', () => {
        Macros.show();
        expect(renderSpy).toHaveBeenCalledTimes(0);
        expect(console.error).toHaveBeenCalledTimes(1);

        SimpleCalendar.instance.currentYear = y;
        Macros.show();
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledTimes(1);

        //@ts-ignore
        Macros.show('abc');
        expect(y.visibleYear).toBe(0);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect(console.error).toHaveBeenCalledTimes(2);

        Macros.show(1);
        expect(y.visibleYear).toBe(1);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect(console.error).toHaveBeenCalledTimes(2);

        //@ts-ignore
        Macros.show(1, 'abc');
        expect(y.visibleYear).toBe(1);
        expect(y.months[0].visible).toBe(true);
        expect(renderSpy).toHaveBeenCalledTimes(4);
        expect(console.error).toHaveBeenCalledTimes(3);

        Macros.show(1, 1);
        expect(y.visibleYear).toBe(1);
        expect(y.months[0].visible).toBe(false);
        expect(y.months[1].visible).toBe(true);
        expect(renderSpy).toHaveBeenCalledTimes(5);
        expect(console.error).toHaveBeenCalledTimes(3);

        y.months[0].visible = true;
        y.months[1].visible = false;
        Macros.show(1, -1);
        expect(y.visibleYear).toBe(1);
        expect(y.months[0].visible).toBe(false);
        expect(y.months[1].visible).toBe(true);
        expect(renderSpy).toHaveBeenCalledTimes(6);
        expect(console.error).toHaveBeenCalledTimes(3);

        //@ts-ignore
        Macros.show(1, 0, 'asd');
        expect(y.visibleYear).toBe(1);
        expect(y.months[0].visible).toBe(true);
        expect(y.months[0].days[0].selected).toBe(true);
        expect(renderSpy).toHaveBeenCalledTimes(7);
        expect(console.error).toHaveBeenCalledTimes(4);

        Macros.show(1, 0, 0);
        expect(y.visibleYear).toBe(1);
        expect(y.months[0].visible).toBe(true);
        expect(y.months[0].days[0].selected).toBe(true);
        expect(renderSpy).toHaveBeenCalledTimes(8);
        expect(console.error).toHaveBeenCalledTimes(4);

        Macros.show(4, 0, 2);
        expect(y.visibleYear).toBe(4);
        expect(y.months[0].visible).toBe(true);
        expect(y.months[0].days[1].selected).toBe(true);
        expect(renderSpy).toHaveBeenCalledTimes(9);
        expect(console.error).toHaveBeenCalledTimes(4);

        Macros.show(1, 0, -1);
        expect(y.visibleYear).toBe(1);
        expect(y.months[0].visible).toBe(true);
        expect(y.months[0].days[4].selected).toBe(true);
        expect(renderSpy).toHaveBeenCalledTimes(10);
        expect(console.error).toHaveBeenCalledTimes(4);

        y.months[0].visible = false;
        Macros.show(1, null, 1);
        expect(y.visibleYear).toBe(1);
        expect(y.months[0].visible).toBe(false);
        expect(y.months[0].days[0].selected).toBe(true);
        expect(renderSpy).toHaveBeenCalledTimes(11);
        expect(console.error).toHaveBeenCalledTimes(4);

        y.months[0].current = false;
        Macros.show(1, null, 2);
        expect(y.visibleYear).toBe(1);
        expect(y.months[0].visible).toBe(false);
        expect(y.months[0].days[0].selected).toBe(true);
        expect(y.months[0].days[1].selected).toBe(false);
        expect(renderSpy).toHaveBeenCalledTimes(12);
        expect(console.error).toHaveBeenCalledTimes(4);

        y.leapYearRule.rule = LeapYearRules.Gregorian;
        Macros.show(4, 0, 2);
        expect(y.visibleYear).toBe(4);
        expect(y.months[0].visible).toBe(true);
        expect(y.months[0].days[1].selected).toBe(true);
        expect(renderSpy).toHaveBeenCalledTimes(13);
        expect(console.error).toHaveBeenCalledTimes(4);
    });

    test('Set Date Time', () => {
        Macros.setDateTime();
        expect(renderSpy).toHaveBeenCalledTimes(0);

        //@ts-ignore
        game.user.isGM = true;
        Macros.setDateTime();
        expect(renderSpy).toHaveBeenCalledTimes(0);
        expect(console.error).toHaveBeenCalledTimes(1);

        SimpleCalendar.instance.currentYear = y;
        Macros.setDateTime();
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(y.numericRepresentation).toBe(0);
        expect(y.months[0].current).toBe(true);
        expect(y.months[0].days[0].current).toBe(true);
        expect(y.time.seconds).toBe(0);

        Macros.setDateTime(1,2,3,4,5,6);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(y.numericRepresentation).toBe(1);
        expect(y.months[1].current).toBe(true);
        expect(y.months[1].days[2].current).toBe(true);
        expect(y.time.seconds).toBe(14706);

        y.months[1].current = false;
        y.months[1].days[2].current = false;
        Macros.setDateTime(1,null,null,4,5,6);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(y.numericRepresentation).toBe(1);
        expect(y.months[0].current).toBe(true);
        expect(y.months[0].days[0].current).toBe(true);
        expect(y.time.seconds).toBe(14706);

        y.months[0].days[0].current = false;
        Macros.setDateTime(1,1,null,4,5,6);
        expect(renderSpy).toHaveBeenCalledTimes(4);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(y.numericRepresentation).toBe(1);
        expect(y.months[1].current).toBe(true);
        expect(y.months[1].days[0].current).toBe(true);
        expect(y.time.seconds).toBe(14706);

        //@ts-ignore
        game.user.isGM = false;
    });

    test('Change Date Time', () => {
        Macros.changeDateTime();
        expect(renderSpy).toHaveBeenCalledTimes(0);

        //@ts-ignore
        game.user.isGM = true;
        Macros.changeDateTime();
        expect(renderSpy).toHaveBeenCalledTimes(0);
        expect(console.error).toHaveBeenCalledTimes(1);

        SimpleCalendar.instance.currentYear = y;
        Macros.changeDateTime();
        expect(renderSpy).toHaveBeenCalledTimes(0);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(y.numericRepresentation).toBe(0);
        expect(y.months[0].current).toBe(true);
        expect(y.months[0].days[0].current).toBe(true);
        expect(y.time.seconds).toBe(0);

        Macros.changeDateTime(1,1,1,1,1,1);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(y.numericRepresentation).toBe(1);
        expect(y.months[1].current).toBe(true);
        expect(y.months[1].days[1].current).toBe(true);
        expect(y.time.seconds).toBe(3661);

        //@ts-ignore
        game.user.isGM = false;
    });
});
