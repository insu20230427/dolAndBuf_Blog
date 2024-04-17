package com.insu.blog.dto.response;


import lombok.Data;

@Data
public class KakaoUserInfoResponseDto {
    private Long id;
    private String connected_at;
    private Properties properties;

    @Data
    public class Properties {
        private String nickname;
        private String profile_image;
        private String thumbnail_image;
    }

    private KakaoAccount kakao_account;

    @Data
    public class KakaoAccount {
        private Boolean profile_nickname_needs_agreement;
        private Boolean profile_image_needs_agreement;
        private Profile profile;

        @Data
        public class Profile {
            private String nickname;
            private String thumbnail_image_url;
            private String profile_image_url;
            private Boolean is_default_image;
            private Boolean is_default_nickname;
        }
    }
}
