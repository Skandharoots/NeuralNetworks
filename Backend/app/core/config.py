from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Annotated, Any, Literal, Union

from pydantic import (
    AnyUrl,
    BeforeValidator,
    computed_field,
    MySQLDsn,
    Field
)

from pydantic_core import MultiHostUrl


def parse_cors(v: Any) -> Union[list[str], str]:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, (list, str)):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        extra="ignore",
        env_ignore_empty = True,
    )
    DOMAIN: str = 'localhost'
    ENVIRONMENT: Literal["local", "staging", "production"] = "local"
    JWT_SECRET_KEY: str
    AZURE_CONN_STR: str

    @computed_field
    @property
    def server_host(self) -> str:
        # Use HTTPS for anything other than local development
        if self.ENVIRONMENT == "local":
            return f"http://{self.DOMAIN}"
        return f"https://{self.DOMAIN}"

    BACKEND_CORS_ORIGINS: Annotated[
        Union[list[AnyUrl], str], BeforeValidator(parse_cors)
    ] = Field(default_factory=list)

    MYSQL_USERNAME: str
    MYSQL_PASSWORD: str
    MYSQL_SERVER: str
    MYSQL_PORT: int
    MYSQL_DATABASE: str

    @computed_field  # type: ignore[misc]
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return str(
            MultiHostUrl.build(
                scheme="mysql+pymysql",
                username=self.MYSQL_USERNAME,
                password=self.MYSQL_PASSWORD,
                host=self.MYSQL_SERVER,
                port=self.MYSQL_PORT,
                path=self.MYSQL_DATABASE,
            )
        )