'use strict';
/* eslint-env node, es6 */

const stylelint = require('stylelint');
const functionArgumentsSearch = require('stylelint/dist/utils/functionArgumentsSearch').default;
const report = stylelint.utils.report;
const ruleMessages = stylelint.utils.ruleMessages;
const validateOptions = stylelint.utils.validateOptions;

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
			functionArgumentsSearch(decl.toString().toLowerCase(), 'url', (args, index) => {
				const isRoot = /^\s*['"]?\s*\/(?!\/)/.test(args);
				const rootExpected = (options === 'always');
				if (isRoot !== rootExpected) {
					report({
						message: rootExpected ? messages.expected : messages.rejected,
						node: decl,
						index,
						result,
						ruleName,
					});
				}
			});
		});
	};
});

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
