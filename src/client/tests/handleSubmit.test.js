import {handleSubmit} from "../js/app";
import {describe, expect} from "@jest/globals";


describe('Testing handleSubmit function', () => {
    test('It should return true because the function is defined', () => {
        expect(handleSubmit).toBeDefined();
    });
    test('It should return true as handleSubmit is a function', () => {
        expect(typeof handleSubmit).toBe('function');
    });
});

