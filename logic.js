// Значения постоянных параметров модели
const PARAMS = {
    p: 200000,
    a: 1.1,
    m: 1000,
    u: 10,
    cx: 0.2,
    cy: 0.05,
    m1: 0.03,
    m2: 0.003,
    T: 12,
    g: 9.81
}

// допустимая погрешность
const INACCURACY = 0.01

// кол-во уравнений
const NUMBER_EQUATIONS = 5

// расчет относительной погрешности
const calcInaccuracy = (y, y1) => Math.abs((y1 - y) / y1)

// главная ф-ция
const start = (h) => {
    const times = [0.0]
    const values = [[1000, 0.5, 0, 0, 0.5]]
    
    const y0 = (t, j) => - PARAMS.g * Math.sin(values[j][1]) 
                        + (PARAMS.p - PARAMS.a * PARAMS.cx * values[j][0] * values[j][0])
                        /(PARAMS.m - PARAMS.u*t)

    const y1 = (t, j) => (-PARAMS.g + (PARAMS.p * Math.sin(values[j][4]-values[j][1]) 
                        + PARAMS.a*PARAMS.cy*values[j][0]*values[j][0])
                        /(PARAMS.m - PARAMS.u*t))
                        /(values[j][0])

    const y2 = (t, j) => (PARAMS.m1*PARAMS.a*(values[j][1] - values[j][4])*values[j][0]*values[j][0]
                        - PARAMS.m2*PARAMS.a*values[j][0]*values[j][0]*values[j][2])
                        /(PARAMS.m - PARAMS.u*t)

    const y3 = (t, j) => values[j][0] * Math.sin(values[j][1])

    const y4 = (t, j) => values[j][2]

    const eulerMethod = (prevValue, prevStep, y, t) => {
        return prevValue + y(t, prevStep) * h
    }

    const solve = (nextStep, t) => {
        let newValues = []
        let prevStep = nextStep - 1
    
        newValues.push(eulerMethod(values[prevStep][0], prevStep, y0, t))
        newValues.push(eulerMethod(values[prevStep][1], prevStep, y1, t))
        newValues.push(eulerMethod(values[prevStep][2], prevStep, y2, t))
        newValues.push(eulerMethod(values[prevStep][3], prevStep, y3, t))
        newValues.push(eulerMethod(values[prevStep][4], prevStep, y4, t))
    
        return newValues
    }

    let t = 0.0
    let j = 0
    while (t < PARAMS.T) {
        t += h
        j += 1
        let nextValues = solve(j, t);
        times.push(t)
        values.push(nextValues)
    }

    return {
        times, values
    }
}