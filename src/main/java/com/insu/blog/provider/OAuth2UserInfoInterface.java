package com.insu.blog.provider;

public interface OAuth2UserInfoInterface {
    String getProviderId();

    String getProvider();

    String getEmail();

    String getName();
}
