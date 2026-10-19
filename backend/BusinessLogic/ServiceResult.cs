namespace Backend.BusinessLogic;

// ผลลัพธ์จาก business logic: สำเร็จ หรือล้มเหลวพร้อม HTTP status + body ของ error
public record ServiceResult<T>(T? Value, int Status = 200, object? Error = null)
{
    public bool IsSuccess => Error is null;
    public static ServiceResult<T> Ok(T value) => new(value);
    public static ServiceResult<T> Fail(int status, object error) => new(default, status, error);
}
