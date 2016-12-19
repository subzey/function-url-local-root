'use strict';
/* eslint-env node, es6 */

const stylelint = require('stylelint');
const report = stylelint.utils.report;
const ruleMessages = stylelint.utils.ruleMessages;
const validateOptions = stylelint.utils.validateOptions;
const styleSearch = require('style-search');
const balancedMatch = require('balanced-match');

const ruleName = 'tradingview/function-url-local-root';

const messages = ruleMessages(ruleName, {
	expected: 'Expected URL from local root',
	rejected: 'Unexpected URL from local root',
});

const rule = stylelint.createPlugin(ruleName, function(options) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			possible: ['always', 'never'],
			actual: options
		});
		if (!validOptions) {
			return;
		}

		root.walkDecls(function(decl) {
			const source = decl.toString();
			styleSearch(
				{
					source: source.toLowerCase(),
					target: 'url',
					functionNames: 'check',
				},
				(match) => {
					if (source[match.endIndex] !== "(") {
						return;
					}
					const parensMatch = balancedMatch("(", ")", source.substr(match.startIndex));
					const isRoot = /^\s*['"]?\s*\/(?!\/)/.test(parensMatch.body);
					const rootExpected = (options === 'always');
					if (isRoot !== rootExpected) {
						report({
							message: rootExpected ? messages.expected : messages.rejected,
							node: decl,
							index: match.endIndex + 1,
							result,
							ruleName,
						});
					}
				}
			);
		});
	};
});

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
