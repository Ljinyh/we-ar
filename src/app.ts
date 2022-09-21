function evaluate(expression: string): number {
    // 여기에 코드를 작성해주세요.
    const newExpression: string = expression.split(' ').join('');

    const newArr: string[] = convert(newExpression);
    console.log(newArr)

    const stack: string[] = [];
    let back_answer: string[] = [];

    // 후위 표기식으로 변경
    for (let i = 0; i < newArr.length; i++) {
        const element = newArr[i];

        if (element === '(') {
            stack.push(element)
        } else if (element === ')') {
            // 닫는 괄호가 나오면  스택에서 여는 괄호가 나올때까지 값을 꺼내어 출력
            while (stack.length && stack[stack.length - 1] !== '(') {
                const POP = stack.pop();
                if (POP) {
                    back_answer.push(POP);
                }
            }
            stack.pop(); // '(' 제거
        } else if (element === 'sin' || element === 'cos' || element === 'tan') {
            while (stack.length && stack[stack.length - 1] !== '(') {
                const POP = stack.pop();
                if (POP) {
                    back_answer.push(POP);
                }
            }
            stack.push(element);
        } else if (element === '*' || element === '/') {
            // 연산자가 나오면 스택이 비어있으면 연산자를 스택에 넣는다.
            // 스택이 비어있지 않으면 스택의 최상위 노드를 비교하여,
            // 현재 연산자가 스택의 top보다 우선순위가 낮거나 같으면 스택의 값을 꺼내어 출력
            while (stack.length && stack[stack.length - 1] === '*' || stack[stack.length - 1] === '/') {
                const POP = stack.pop();
                if (POP) {
                    back_answer.push(POP);
                }
            }

            // 현재 연산자가 우선순위가 높으면 스택에 넣고 끝낸다.
            stack.push(element);
        }
        else if (element === '+' || element === '-') {
            while (stack.length && stack[stack.length - 1] !== '(') {
                const POP = stack.pop();
                if (POP) {
                    back_answer.push(POP);
                }
            }
            stack.push(element);
        } else {
            back_answer.push(element);
        }
    }

    // 중위표기식을 다 읽었으면, 스택의 연산자들을 꺼내 출력한다.
    while (stack.length) {
        const POP = stack.pop();
        if (POP) {
            back_answer.push(POP);
        }
    }


    let result: number = 0;
    let stack_2: number[] = [];

    for (let i of back_answer) {
        //숫자라면
        if (!isNaN(Number(i))) {
            stack_2.push(Number(i));
        } else {
            let right: number | undefined = stack_2.pop();
            let left: number | undefined = stack_2.pop();

            if (right === undefined || left === undefined) {
                continue;
            }

            if (i === "+") {
                stack_2.push(left + right);
            } else if (i === "-") {
                stack_2.push(left - right);
            } else if (i === '*') {
                stack_2.push(left * right);
            } else if (i === "/") {
                stack_2.push(left / right);
            } else if (i === 'sin') {
                stack_2.push(Math.sin(right));
            } else if (i === 'cos') {
                stack_2.push(Math.cos(right));
            } else if (i === 'tan') {
                stack_2.push(Math.tan(right));
            };
        };
    };

    result = stack_2[0];

    return result;
}

const convert = (str: string) => {
    let result = [];
    let temp = '';
    for (let i = 0; i < str.length; i++) {
        //숫자(음수포함)거나 '.' 이면
        while (str[i] && (!isNaN(Number(str[i])) || str[i] === '.' || (isNaN((Number(str[i - 1]))) && str[i] === '-'))) {
            temp += str[i];
            i++;
        }
        if (temp) result.push(temp);
        // 연산자이면
        if (str[i] && isNaN(Number(str[i]))) {
            while (str[i] && str[i] === 's' && str[i + 1] === 'i' && str[i + 2] === 'n' ||
                str[i - 1] === 's' && str[i] === 'i' && str[i + 1] === 'n' ||
                str[i - 2] === 's' && str[i - 1] === 'i' && str[i] === 'n') {
                temp += str[i];
                i++;
            }
            if (temp == 'sin') result.push(temp);

            while (str[i] && str[i] === 'c' && str[i + 1] === 'o' && str[i + 2] === 's' ||
                str[i - 1] === 'c' && str[i] === 'o' && str[i + 1] === 's' ||
                str[i - 2] === 'c' && str[i - 1] === 'o' && str[i] === 's') {
                temp += str[i];
                i++;
            }
            if (temp == 'cos') result.push(temp);

            while (str[i] && str[i] === 't' && str[i + 1] === 'a' && str[i + 2] === 'n' ||
                str[i - 1] === 't' && str[i] === 'a' && str[i + 1] === 'n' ||
                str[i - 2] === 't' && str[i - 1] === 'a' && str[i] === 'n') {
                temp += str[i];
                i++;
            }
            if (temp == 'tan') result.push(temp);

            result.push(str[i]);
            temp = '';
        }
    }
    return result;
}

evaluate('1 + 2 * 3'); // 7
evaluate('(1 + 2) * 3'); // 9
evaluate('1 / 32.5 + 167 * (3498 - 1155) * -721 * (4885 - 1) / 0.5'); // -2755685654567.969
evaluate('sin(cos(1)) * cos(1)') // 0.2779289443079115