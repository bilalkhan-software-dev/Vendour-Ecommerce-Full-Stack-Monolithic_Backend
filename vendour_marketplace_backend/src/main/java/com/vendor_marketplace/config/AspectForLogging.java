package com.vendor_marketplace.config;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class AspectForLogging {

    @Around("execution(* com.vendor_marketplace.endpoint..*(..))")
    public Object loggerForController(ProceedingJoinPoint joinPoint) throws Throwable {
        return getObject(joinPoint);
    }

    @Around("execution(* com.vendor_marketplace.services..*(..))")
    public Object loggerForService(ProceedingJoinPoint joinPoint) throws Throwable {
        return getObject(joinPoint);
    }

    private Object getObject(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        Signature signature = joinPoint.getSignature();
        String className = signature.getDeclaringType().getSimpleName();
        String methodName = signature.getName();
        log.info("Calling :: {} :: {}()", className, methodName);
        Object proceed = joinPoint.proceed();
        long duration = System.currentTimeMillis() - startTime;
        log.info("End :: {} :: {}() ==> Total duration during this process: {}ms", className, methodName, duration);
        return proceed;
    }

}
