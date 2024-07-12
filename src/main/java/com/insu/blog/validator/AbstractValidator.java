package com.insu.blog.validator;

import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

@Component
public abstract class AbstractValidator<T> implements Validator {

    // Vaalidator가 지원하는 클래스인지 확인
    @Override
    public boolean supports(Class<?> clazz) {
        return true;
    }

    // 유효성 검사 진행
    @SuppressWarnings("unchecked")
    @Override
    public void validate(Object target, Errors errors) {
        try {
            doValidate((T) target, errors);
        } catch (RuntimeException e) {
            throw e;
        }
    }

    @Override
    public Errors validateObject(Object target) {
        return Validator.super.validateObject(target);
    }

    // 추상 메서드(상속받아 구현해야됨)
    protected abstract void doValidate(final T dto, final Errors errors);

}
