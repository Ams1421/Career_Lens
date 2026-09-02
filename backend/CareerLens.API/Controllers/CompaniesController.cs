using CareerLens.Application.DTOs.Companies;
using CareerLens.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareerLens.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CompaniesController : ControllerBase
{
    private readonly ICompanyService _companyService;

    public CompaniesController(
        ICompanyService companyService)
    {
        _companyService = companyService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CompanyDto>>> GetAll(
        CancellationToken cancellationToken)
    {
        IReadOnlyList<CompanyDto> companies =
            await _companyService.GetAllAsync(
                cancellationToken);

        return Ok(companies);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CompanyDto>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        CompanyDto? company =
            await _companyService.GetByIdAsync(
                id,
                cancellationToken);

        if (company is null)
        {
            return NotFound(new
            {
                message = "Company not found."
            });
        }

        return Ok(company);
    }

    [HttpPost]
    public async Task<ActionResult<CompanyDto>> Create(
        [FromBody] CreateCompanyDto request,
        CancellationToken cancellationToken)
    {
        CompanyDto? company =
            await _companyService.CreateAsync(
                request,
                cancellationToken);

        if (company is null)
        {
            return Conflict(new
            {
                message =
                    "A company with this name already exists."
            });
        }

        return Ok(company);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CompanyDto>> Update(
        Guid id,
        [FromBody] UpdateCompanyDto request,
        CancellationToken cancellationToken)
    {
        CompanyDto? company =
            await _companyService.UpdateAsync(
                id,
                request,
                cancellationToken);

        if (company is null)
        {
            return NotFound(new
            {
                message =
                    "Company not found or company name already exists."
            });
        }

        return Ok(company);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken)
    {
        bool deleted =
            await _companyService.DeleteAsync(
                id,
                cancellationToken);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Company not found."
            });
        }

        return NoContent();
    }
}